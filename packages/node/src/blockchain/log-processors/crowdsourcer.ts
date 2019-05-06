import { Address, Augur, BigNumber, DisputeWindowState, FormattedEventLog, ReportingState } from "../../types";
import { BigNumber as BigNumberJS } from "bignumber.js";

import Knex from "knex";
import { QueryBuilder } from "knex";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";
import { augurEmitter } from "../../events";
import {
  insertPayout,
  rollbackMarketState,
  updateDisputeRound,
  updateMarketDisputeWindow,
  updateMarketState
} from "./database";
import { groupByAndSum } from "../../server/getters/database";
import { SubscriptionEventNames } from "../../constants";

interface StakesByPayoutId {
  payoutId: number;
  amountStaked: BigNumber;
}

async function updateTentativeWinningPayout(db: Knex, marketId: Address) {
  const results: Array<StakesByPayoutId> = await db.from("crowdsourcers").select(["payoutId", "amountStaked"]).where({
    completed: 1,
    marketId,
  }).union((builder: QueryBuilder) =>
    builder.select(["payoutId", "amountStaked"]).from("initial_reports").where("marketId", marketId),
  );
  const summed = groupByAndSum(results, ["payoutId"], ["amountStaked"])
    .sort((a: StakesByPayoutId, b: StakesByPayoutId) => new BigNumberJS(b.amountStaked.toString()).comparedTo(new BigNumberJS(a.amountStaked.toString())));
  const mostStakedPayoutId = summed[0];
  const query = db("payouts").update("tentativeWinning", 0).where("marketId", marketId);
  if (mostStakedPayoutId != null) query.whereNot("payoutId", mostStakedPayoutId.payoutId);
  await query;
  if (mostStakedPayoutId != null) {
    await db("payouts").update("tentativeWinning", 1).where("marketId", marketId).where("payoutId", mostStakedPayoutId.payoutId);
  }
}

function updateIncompleteCrowdsourcers(db: Knex, marketId: Address) {
  return db("crowdsourcers").update({ completed: 0, disavowed: db.raw("disavowed + 1") }).where({ marketId, completed: null });
}

function rollbackIncompleteCrowdsourcers(db: Knex, marketId: Address) {
  return db("crowdsourcers").update({ completed: null, disavowed: db.raw("disavowed - 1") }).where({ marketId, completed: 0 });
}

function rollbackCrowdsourcerCompletion(db: Knex, crowdsourcerId: Address, marketId: Address) {
  // Set all crowdsourcers to completed: null, so long as they match the rollback's dispute crowdsourcer's fee window and market
  return db("crowdsourcers").update({ completed: null }).where({ marketId }).whereIn("disputeWindow",
    (queryBuilder: QueryBuilder) => {
      queryBuilder.select("disputeWindow").from("crowdsourcers").where({ crowdsourcerId });
    });
}

export async function processDisputeCrowdsourcerCreatedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const payoutId: number = await insertPayout(db, log.market, log.payoutNumerators, false);
    const disputeWindowRow: { disputeWindow: string }|null = await db("dispute_windows").select(["disputeWindow"]).first()
      .where("state", DisputeWindowState.CURRENT)
      .where({ universe: log.universe });
    if (disputeWindowRow == null) throw new Error(`could not retrieve disputeWindow for crowdsourcer: ${log.disputeCrowdsourcer}`);
    const crowdsourcerToInsert = {
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      crowdsourcerId: log.disputeCrowdsourcer,
      marketId: log.market,
      disputeWindow: disputeWindowRow.disputeWindow,
      size: log.size,
      payoutId,
      completed: null,
      disavowed: 0,
    };
    await db.insert(crowdsourcerToInsert).into("crowdsourcers");
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerCreated, Object.assign({},
      log,
      crowdsourcerToInsert));
    return db.insert({ contractAddress: log.disputeCrowdsourcer, marketId: log.market, symbol: "Crowdsourcer" }).into("tokens");
  };
}

export async function processDisputeCrowdsourcerCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("crowdsourcers").where("crowdsourcerId", log.disputeCrowdsourcer).del();
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerCreated, Object.assign({},
      log,
      { marketId: log.market }));
    return db.from("tokens").where({ contractAddress: log.disputeCrowdsourcer }).del();
  };
}

export async function processDisputeCrowdsourcerContributionLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const disputeToInsert = formatBigNumberAsFixed({
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      reporter: log.reporter,
      crowdsourcerId: log.disputeCrowdsourcer,
      amountStaked: log.amountStaked,
    });
    await db.insert(disputeToInsert).into("disputes");
    const result: { amountStaked: BigNumber } = await db("crowdsourcers").first("amountStaked").where("crowdsourcerId", log.disputeCrowdsourcer);
    const amountStaked = result.amountStaked.add(new BigNumber(log.amountStaked)).toString();
    await db("crowdsourcers").update({ amountStaked }).where("crowdsourcerId", log.disputeCrowdsourcer);
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerContribution, Object.assign({},
      log,
      disputeToInsert,
      { marketId: log.market }));
  };
}

export async function processDisputeCrowdsourcerContributionLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("disputes").where({
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
    }).del();
    const result: { amountStaked: BigNumber } = await db("crowdsourcers").first("amountStaked").where("crowdsourcerId", log.disputeCrowdsourcer);
    const amountStaked = result.amountStaked.sub(new BigNumber(log.amountStaked)).toString();
    await db("crowdsourcers").update({ amountStaked }).where("crowdsourcerId", log.disputeCrowdsourcer);
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerContribution, Object.assign({},
      log,
      { marketId: log.market }));
  };
}

export async function processDisputeCrowdsourcerCompletedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db("crowdsourcers").update({ completed: 1 }).where({ crowdsourcerId: log.disputeCrowdsourcer });
    await updateMarketState(db, log.market, log.blockNumber, ReportingState.AWAITING_NEXT_WINDOW);
    await updateDisputeRound(db, log.market);
    await updateMarketDisputeWindow(db, augur, log.universe, log.market, true);
    await updateIncompleteCrowdsourcers(db, log.market);
    await updateTentativeWinningPayout(db, log.market);
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerCompleted, Object.assign({},
      log,
      { marketId: log.market }));
  };
}

export async function processDisputeCrowdsourcerCompletedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await rollbackCrowdsourcerCompletion(db, log.disputeCrowdsourcer, log.market);
    await rollbackMarketState(db, log.market, ReportingState.AWAITING_NEXT_WINDOW);
    await updateDisputeRound(db, log.market);
    await updateMarketDisputeWindow(db, augur, log.universe, log.market, false);
    await rollbackIncompleteCrowdsourcers(db, log.market);
    await updateTentativeWinningPayout(db, log.market);
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerCompleted, Object.assign({},
      log,
      { marketId: log.market }));
  };
}

export async function processDisputeCrowdsourcerRedeemedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
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
    await db.insert(redeemedToInsert).into("crowdsourcer_redeemed");
    augurEmitter.emit(SubscriptionEventNames.DisputeCrowdsourcerRedeemedLog, log);
  };
}

export async function processDisputeCrowdsourcerRedeemedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("crowdsourcer_redeemed").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del();
    augurEmitter.emit(SubscriptionEventNames.DisputeWindowRedeemed, log);
  };
}
