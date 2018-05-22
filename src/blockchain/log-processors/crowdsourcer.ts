import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { FormattedEventLog, ErrorCallback, Address, AsyncCallback, FeeWindowState } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { augurEmitter } from "../../events";
import { updateMarketState, rollbackMarketState, insertPayout, updateDisputeRound, updateMarketFeeWindow } from "./database";
import { groupByAndSum } from "../../server/getters/database";
import { QueryBuilder } from "knex";
import { parallel } from "async";

interface StakesByPayoutId {
  payoutId: number;
  amountStaked: BigNumber;
}

function updateTentativeWinningPayout(db: Knex, marketId: Address, callback: ErrorCallback) {
  db.from("crowdsourcers").select(["payoutId", "amountStaked"]).where({
    completed: 1,
    marketId,
  }).union((builder: QueryBuilder) =>
    builder.select(["payoutId", "amountStaked"]).from("initial_reports").where("marketId", marketId),
  ).asCallback((err: Error|null, results: Array<StakesByPayoutId>) => {
    if (err) return callback(err);
    const summed = groupByAndSum(results, ["payoutId"], ["amountStaked"])
      .sort((a: StakesByPayoutId, b: StakesByPayoutId) => b.amountStaked.comparedTo(a.amountStaked));

    const mostStakedPayoutId = summed[0];
    parallel([
      (next: AsyncCallback) => {
        const query = db("payouts").update("tentativeWinning", 0).where("marketId", marketId);
        if (mostStakedPayoutId != null) query.whereNot("payoutId", mostStakedPayoutId.payoutId);
        query.asCallback(next);
      },
      (next: AsyncCallback) => {
        if (mostStakedPayoutId == null) return next(null);
        db("payouts").update("tentativeWinning", 1).where("marketId", marketId).where("payoutId", mostStakedPayoutId.payoutId).asCallback(next);
      },
    ], callback);
  });
}

function updateIncompleteCrowdsourcers(db: Knex, marketId: Address, callback: ErrorCallback) {
  db("crowdsourcers").update({ completed: 0, disavowed: db.raw("disavowed + 1") }).where({ marketId, completed: null }).asCallback(callback);
}

function rollbackIncompleteCrowdsourcers(db: Knex, marketId: Address, callback: ErrorCallback) {
  db("crowdsourcers").update({ completed: null, disavowed: db.raw("disavowed - 1") }).where({ marketId, completed: 0 }).asCallback(callback);
}

function rollbackCrowdsourcerCompletion(db: Knex, crowdsourcerId: Address, marketId: Address, callback: ErrorCallback) {
  // Set all crowdsourcers to completed: null, so long as they match the rollback's dispute crowdsourcer's fee window and market
  db("crowdsourcers").update({ completed: null }).where({marketId}).whereIn("feeWindow",
    (queryBuilder: QueryBuilder) => { queryBuilder.select("feeWindow").from("crowdsourcers").where({crowdsourcerId});
  }).asCallback(callback);
}

export function processDisputeCrowdsourcerCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  insertPayout(db, log.market, log.payoutNumerators, log.invalid, false, (err, payoutId) => {
    if (err) return callback(err);
    db("fee_windows").select(["feeWindow"]).first()
      .where("state", FeeWindowState.CURRENT)
      .where({ universe: log.universe })
      .asCallback((err: Error|null, feeWindowRow?: { feeWindow: string }|null): void => {
        if (err) return callback(err);
        if (feeWindowRow == null) return callback(new Error(`could not retrieve feeWindow for crowdsourcer: ${log.disputeCrowdsourcer}`));
        const crowdsourcerToInsert = {
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          crowdsourcerId: log.disputeCrowdsourcer,
          marketId: log.market,
          feeWindow: feeWindowRow.feeWindow,
          size: log.size,
          payoutId,
          completed: null,
          disavowed: 0,
        };
        db.insert(crowdsourcerToInsert).into("crowdsourcers").asCallback((err: Error|null): void => {
          if (err) return callback(err);
          augurEmitter.emit("DisputeCrowdsourcerCreated", Object.assign({},
            log,
            crowdsourcerToInsert));
          db.insert({contractAddress: log.disputeCrowdsourcer, marketId: log.market, symbol: "Crowdsourcer"}).into("tokens").asCallback(callback);
        });
      });
  });
}

export function processDisputeCrowdsourcerCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("crowdsourcers").where("crowdsourcerId", log.disputeCrowdsourcer).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("DisputeCrowdsourcerCreated", Object.assign({},
      log,
      { marketId: log.market }));
    db.where({contractAddress: log.disputeCrowdsourcer }).from("tokens").del().asCallback(callback);
  });
}

export function processDisputeCrowdsourcerContributionLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const disputeToInsert = formatBigNumberAsFixed({
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    reporter: log.reporter,
    crowdsourcerId: log.disputeCrowdsourcer,
    amountStaked: log.amountStaked,
  });
  db.insert(disputeToInsert).into("disputes").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db("crowdsourcers").first("amountStaked").where("crowdsourcerId", log.disputeCrowdsourcer).asCallback((err: Error|null, result: { amountStaked: BigNumber }): void => {
      if (err) return callback(err);
      const amountStaked = result.amountStaked.plus(new BigNumber(log.amountStaked, 10)).toFixed();
      db("crowdsourcers").update({ amountStaked }).where("crowdsourcerId", log.disputeCrowdsourcer).asCallback((err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("DisputeCrowdsourcerContribution", Object.assign({},
          log,
          disputeToInsert,
          { marketId: log.market }));
        callback(null);
      });
    });
  });
}

export function processDisputeCrowdsourcerContributionLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("disputes").where({
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db("crowdsourcers").first("amountStaked").where("crowdsourcerId", log.disputeCrowdsourcer).asCallback((err: Error|null, result: { amountStaked: BigNumber }): void => {
      if (err) return callback(err);
      const amountStaked = result.amountStaked.minus(new BigNumber(log.amountStaked, 10)).toFixed();
      db("crowdsourcers").update({ amountStaked }).where("crowdsourcerId", log.disputeCrowdsourcer).asCallback((err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("DisputeCrowdsourcerContribution", Object.assign({},
          log,
          { marketId: log.market }));
        callback(null);
      });
    });
  });
}

export function processDisputeCrowdsourcerCompletedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").update({ completed: 1 }).where({ crowdsourcerId: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback) => updateMarketState(db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, next),
      (next: AsyncCallback) => updateDisputeRound(db, log.market, next),
      (next: AsyncCallback) => updateMarketFeeWindow(db, augur, log.universe, log.market, true, next),
      (next: AsyncCallback) => updateIncompleteCrowdsourcers(db, log.market, next),
    ], (err: Error|null) => {
      if (err) return callback(err);
      updateTentativeWinningPayout(db, log.market, (err: Error|null) => {
        if (err) return callback(err);
        augurEmitter.emit("DisputeCrowdsourcerCompleted", Object.assign({},
          log,
          { marketId: log.market }));
        callback(null);
      });
    });
  });
}

export function processDisputeCrowdsourcerCompletedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  rollbackCrowdsourcerCompletion(db, log.disputeCrowdsourcer, log.market, (err: Error|null) => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback) => rollbackMarketState(db, log.market, augur.constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, next),
      (next: AsyncCallback) => updateDisputeRound(db, log.market, next),
      (next: AsyncCallback) => updateMarketFeeWindow(db, augur, log.universe, log.market, false, next),
      (next: AsyncCallback) => rollbackIncompleteCrowdsourcers(db, log.market, next),
      (next: AsyncCallback) => updateTentativeWinningPayout(db, log.market, next),
    ], (err: Error|null) => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerCompleted", Object.assign({},
        log,
        { marketId: log.market }));
      callback(null);
    });
  });
}

export function processDisputeCrowdsourcerRedeemedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const redeemedToInsert = {
    reporter: log.reporter,
    crowdsourcer: log.disputeCrowdsourcer,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    amountRedeemed: log.amountRedeemed, // attoRep
    repReceived: log.repReceived,
    reportingFeesReceived: log.reportingFeesReceived, // attoEth
  };
  db.insert(redeemedToInsert).into("crowdsourcer_redeemed").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("DisputeCrowdsourcerRedeemedLog", log);
    callback(null);
  });
}

export function processDisputeCrowdsourcerRedeemedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("crowdsourcer_redeemed").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("FeeWindowRedeemed", log);
    callback(null);
  });
}
