import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, AsyncCallback } from "../../types";
import { augurEmitter } from "../../events";
import { updateMarketState, rollbackMarketState, insertPayout } from "./database";
import { QueryBuilder } from "knex";
import { parallel } from "async";

function updateTentativeWinningPayout(db: Knex, marketId: Address, callback: ErrorCallback) {
  const query = db.first(["payoutId", "amountStaked"]).from((builder: QueryBuilder) =>
    builder.from("crowdsourcers").select("payoutId", "amountStaked").where({
      completed: 1,
      marketId,
    }).union((builder: QueryBuilder) =>
      builder.select(["payoutId", "amountStaked"]).from("initial_reports").where("marketId", marketId),
    )).orderBy("sum(amountStaked)", "desc").groupBy("payoutId");
  query.asCallback((err: Error|null, mostStakedPayoutId) => {
    if (err) return callback(err);
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

function updateMarketReportingRoundsCompleted(db: Knex, marketId: Address, callback: ErrorCallback) {
  db("markets").update({
    reportingRoundsCompleted: db.count("* as completedRounds").from("crowdsourcers").where({ completed: 1, marketId }),
  }).where({ marketId }).asCallback(callback);
}

export function processDisputeCrowdsourcerCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  JSON.stringify(log);
  insertPayout(db, log.market, log.payoutNumerators, log.invalid, false, (err, payoutId) => {
    if (err) return callback(err);
    db("fee_windows").select(["feeWindow"]).first()
      .whereNull("endBlockNumber")
      .where({ universe: log.universe })
      .orderBy("startTime", "ASC")
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
        };
        db.insert(crowdsourcerToInsert).into("crowdsourcers").returning("crowdsourcerId").asCallback((err: Error|null): void => {
          if (err) return callback(err);
          augurEmitter.emit("DisputeCrowdsourcerCreated", log);
          callback(null);
        });
      });
  });
}

export function processDisputeCrowdsourcerCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("crowdsourcers").where("crowdsourcerId", log.disputeCrowdsourcer).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("DisputeCrowdsourcerCreated", log);
    callback(null);
  });
}

export function processDisputeCrowdsourcerContributionLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const disputeToInsert = {
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    reporter: log.reporter,
    crowdsourcerId: log.disputeCrowdsourcer,
    amountStaked: log.amountStaked,
  };
  db.insert(disputeToInsert).into("disputes").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.update("amountStaked", db.raw(`amountStaked + ${log.amountStaked}`)).into("crowdsourcers").where("crowdsourcerId", log.disputeCrowdsourcer).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerContribution", log);
      callback(null);
    });
  });
}

export function processDisputeCrowdsourcerContributionLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("disputes").where({
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.update("amountStaked", db.raw(`amountStaked - ${log.amountStaked}`)).into("crowdsourcers").where("crowdsourcerId", log.disputeCrowdsourcer).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerContribution", log);
      callback(null);
    });
  });
}

export function processDisputeCrowdsourcerCompletedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").update({ completed: 1 }).where({ crowdsourcerId: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback) => updateMarketState(db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, next),
      (next: AsyncCallback) => updateTentativeWinningPayout(db, log.market, next),
      (next: AsyncCallback) => updateMarketReportingRoundsCompleted(db, log.market, next),
    ], (err: Error|null) => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
      callback(null);
    });
  });
}

export function processDisputeCrowdsourcerCompletedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").update({ completed: null }).where({ crowdsourcerId: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback) => rollbackMarketState(db, log.market, augur.constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, next),
      (next: AsyncCallback) => updateTentativeWinningPayout(db, log.market, next),
      (next: AsyncCallback) => updateMarketReportingRoundsCompleted(db, log.market, next),
    ], (err: Error|null) => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
      callback(null);
    });
  });
}

// event DisputeCrowdsourcerRedeemed(address indexed universe, address indexed reporter, address indexed market, address disputeCrowdsourcer, uint256 amountRedeemed, uint256 repReceived, uint256 reportingFeesReceived, uint256[] payoutNumerators);
export function processDisputeCrowdsourcerRedeemedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerRedeemed");
  console.log(log);
  callback(null);
}

export function processDisputeCrowdsourcerRedeemedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerRedeemed removal");
  console.log(log);
  augurEmitter.emit("DisputeCrowdsourcerRedeemed", log);
  callback(null);
}
