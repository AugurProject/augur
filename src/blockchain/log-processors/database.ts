import * as _ from "lodash";
import * as Knex from "knex";
import Augur from "augur.js";
import { BigNumber } from "bignumber.js";
import { Address, ReportingState, AsyncCallback, FeeWindowState} from "../../types";
import { getCurrentTime } from "../process-block";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export interface FeeWindowModifications {
  expiredFeeWindows: Array<Address>;
  newActiveFeeWindows: Array<Address>;
}

function queryCurrentMarketStateId(db: Knex, marketId: Address) {
  return db("market_state").max("marketStateId as latestMarketStateId").first().where({ marketId });
}

async function setMarketStateToLatest(db: Knex, marketId: Address) {
  return db("markets").update({
    marketStateId: queryCurrentMarketStateId(db, marketId),
  }).where({ marketId });
}

// We fallback to the on-chain lookup if we have no row, because there is a possibility due to transaction log ordering
// that we have not yet seen a FeeWindowCreated event. Only happens in test, where a "next" isn't created ahead of time
async function getFeeWindow(db: Knex, augur: Augur, universe: Address, next: boolean): Promise<Address> {
  const feeWindowAtTime = getCurrentTime() + (next ? augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS : 0);
  const feeWindowRow = await db("fee_windows").first("feeWindow").where({ universe }).where("startTime", "<", feeWindowAtTime).where("endTime", ">", feeWindowAtTime);
  if (feeWindowRow !== undefined) return feeWindowRow.feeWindow;
  return augur.api.Universe.getFeeWindowByTimestamp({ _timestamp: feeWindowAtTime, tx: { to: universe } });
}

export async function updateMarketFeeWindow(db: Knex, augur: Augur, universe: Address, marketId: Address, next: boolean) {
  const feeWindow = await getFeeWindow(db, augur, universe, next);
  return db("markets").update({ feeWindow }).where({ marketId });
}

export async function updateMarketState(db: Knex, marketId: Address, blockNumber: number, reportingState: ReportingState) {
  const marketStateDataToInsert = { marketId, reportingState, blockNumber };
  let query = db.insert(marketStateDataToInsert).into("market_state");
  if (db.client.config.client !== "sqlite3") {
    query = query.returning("marketStateId");
  }
  const marketStateId: Array<number> = await query;
  if (!marketStateId || !marketStateId.length) throw new Error("Failed to generate new marketStateId for marketId:" + marketId);
  return setMarketStateToLatest(db, marketId);
}

export async function updateActiveFeeWindows(db: Knex, blockNumber: number, timestamp: number): Promise<FeeWindowModifications> {
  const expiredFeeWindowRows: Array<{ feeWindow: Address; universe: Address }> = await db("fee_windows").select("feeWindow", "universe")
    .whereNot("state", FeeWindowState.PAST)
    .where("endTime", "<", timestamp);
  await db("fee_windows").update("state", FeeWindowState.PAST).whereIn("feeWindow", _.map(expiredFeeWindowRows, (result) => result.feeWindow));

  const newActiveFeeWindowRows: Array<{ feeWindow: Address; universe: Address }> = await db("fee_windows").select("feeWindow", "universe")
    .whereNot("state", FeeWindowState.CURRENT)
    .where("endTime", ">", timestamp)
    .where("startTime", "<", timestamp);
  await db("fee_windows").update("state", FeeWindowState.CURRENT).whereIn("feeWindow", _.map(newActiveFeeWindowRows, (row) => row.feeWindow));

  if (expiredFeeWindowRows != null) {
    expiredFeeWindowRows.forEach((expiredFeeWindowRow) => {
      augurEmitter.emit(SubscriptionEventNames.FeeWindowClosed, Object.assign({
          blockNumber,
          timestamp,
        },
        expiredFeeWindowRow));
    });
  }
  if (newActiveFeeWindowRows != null) {
    newActiveFeeWindowRows.forEach((newActiveFeeWindowRow) => {
      augurEmitter.emit(SubscriptionEventNames.FeeWindowOpened, Object.assign({
          blockNumber,
          timestamp,
        },
        newActiveFeeWindowRow));
    });
  }
  return {
    newActiveFeeWindows: _.map(newActiveFeeWindowRows, (row) => row.feeWindow),
    expiredFeeWindows: _.map(expiredFeeWindowRows, (row) => row.feeWindow),
  };
}

export async function rollbackMarketState(db: Knex, marketId: Address, expectedState: ReportingState) {
  const rowsAffected: number = await db("market_state").delete().where({
    marketStateId: queryCurrentMarketStateId(db, marketId),
    reportingState: expectedState,
  });
  if (rowsAffected === 0) throw new Error(`Unable to rollback market "${marketId}" from reporting state "${expectedState}" because it is not the most current state`);
  return setMarketStateToLatest(db, marketId);
}

export async function insertPayout(db: Knex, marketId: Address, payoutNumerators: Array<string|number|null>, invalid: boolean, tentativeWinning: boolean): Promise<number> {
  const payoutRow: { [index: string]: string|number|boolean|null } = {
    marketId,
    isInvalid: invalid,
  };
  payoutNumerators.forEach((value, i): void => {
    if (value == null) return;
    payoutRow["payout" + i] = new BigNumber(value, 10).toString();
  });
  const payoutIdRow: { payoutId: number }|null = await db.select("payoutId").from("payouts").where(payoutRow).first();
  if (payoutIdRow != null) {
    return payoutIdRow.payoutId;
  } else {
    const payoutRowWithTentativeWinning = Object.assign({},
      payoutRow,
      { tentativeWinning: Number(tentativeWinning) },
    );
    let query = db.insert(payoutRowWithTentativeWinning).into("payouts");
    if (db.client.config.client !== "sqlite3") {
      query = query.returning("payoutId");
    }
    const payoutIdRow: Array<number> = await query;
    if (!payoutIdRow || !payoutIdRow.length) throw new Error("No payoutId returned");
    return payoutIdRow[0];
  }
}

export async function updateDisputeRound(db: Knex, marketId: Address) {
  return db("markets").update({
    disputeRounds: db.count("* as completedRounds").from("crowdsourcers").where({ completed: 1, marketId }),
  }).where({ marketId });
}

export async function refreshMarketMailboxEthBalance(db: Knex, augur: Augur, marketId: Address) {
  const marketCreatorMailboxRow: {marketCreatorMailbox: Address} = await db("markets").first("marketCreatorMailbox").where({ marketId });
  if (!marketCreatorMailboxRow) throw new Error(`Could not get market creator mailbox for market: ${marketId}`);
  return new Promise((resolve, reject) => {
    augur.rpc.eth.getBalance([marketCreatorMailboxRow.marketCreatorMailbox, "latest"], async (err: Error|null, mailboxBalanceResponse: string) => {
      if (err) return reject(err);
      const mailboxBalance = new BigNumber(mailboxBalanceResponse, 16);
      await db("markets").update("marketCreatorFeesBalance", mailboxBalance.toString()).where({ marketId });
      resolve();
    });
  });
}
