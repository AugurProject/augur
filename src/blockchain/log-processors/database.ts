import * as Knex from "knex";
import { Address, ReportingState, AsyncCallback, ErrorCallback, FeeWindowState } from "../../types";
import { BigNumber } from "bignumber.js";
import { getCurrentTime } from "../process-block";
import { augurEmitter } from "../../events";
import * as _ from "lodash";
import Augur from "augur.js";

export interface FeeWindowModifications {
  expiredFeeWindows: Array<Address>;
  newActiveFeeWindows: Array<Address>;
}

function queryCurrentMarketStateId(db: Knex, marketId: Address) {
  return db("market_state").max("marketStateId as latestMarketStateId").first().where({ marketId });
}

function setMarketStateToLatest(db: Knex, marketId: Address, callback: AsyncCallback) {
  db("markets").update({
    marketStateId: queryCurrentMarketStateId(db, marketId),
  }).where({ marketId }).asCallback(callback);
}

export function updateMarketFeeWindow(db: Knex, augur: Augur, universe: Address, marketId: Address, next: boolean, callback: AsyncCallback) {
  const feeWindowAtTime = getCurrentTime() + (next ? augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS : 0);
  augur.api.Universe.getFeeWindowByTimestamp({ _timestamp: feeWindowAtTime, tx: { to: universe } }, (err: Error, feeWindow: Address) => {
    if (err) return callback(err);
    db("markets").update({ feeWindow }).where({ marketId }).asCallback(callback);
  });
}

export function updateMarketState(db: Knex, marketId: Address, blockNumber: number, reportingState: ReportingState, callback: AsyncCallback) {
  const marketStateDataToInsert = { marketId, reportingState, blockNumber };
  db.insert(marketStateDataToInsert).into("market_state").asCallback((err: Error|null, marketStateId?: Array<number>): void => {
    if (err) return callback(err);
    if (!marketStateId || !marketStateId.length) return callback(new Error("Failed to generate new marketStateId for marketId:" + marketId));
    setMarketStateToLatest(db, marketId, callback);
  });
}

export function updateActiveFeeWindows(db: Knex, blockNumber: number, timestamp: number, callback: (err: Error|null, results?: FeeWindowModifications) => void) {
  db("fee_windows").select("feeWindow", "universe")
    .whereNot("state", FeeWindowState.PAST)
    .where("endTime", "<", timestamp)
    .asCallback((err, expiredFeeWindowRows?: Array<{ feeWindow: Address; universe: Address }>) => {
      if (err) return callback(err);
      db("fee_windows").update("state", FeeWindowState.PAST).whereIn("feeWindow", _.map(expiredFeeWindowRows, (result) => result.feeWindow))
        .asCallback((err) => {
          if (err) return callback(err);
          db("fee_windows").select("feeWindow", "universe")
            .whereNot("state", FeeWindowState.CURRENT)
            .where("endTime", ">", timestamp)
            .where("startTime", "<", timestamp)
            .asCallback((err, newActiveFeeWindowRows?: Array<{ feeWindow: Address; universe: Address }>) => {
              if (err) return callback(err);
              db("fee_windows").update("state", FeeWindowState.CURRENT).whereIn("feeWindow", _.map(newActiveFeeWindowRows, (row) => row.feeWindow))
                .asCallback((err) => {
                    if (err) return callback(err);
                    if (expiredFeeWindowRows != null) {
                      expiredFeeWindowRows.forEach((expiredFeeWindowRow) => {
                        augurEmitter.emit("FeeWindowClosed", Object.assign({
                            eventName: "FeeWindowClosed",
                            blockNumber,
                            timestamp,
                          },
                          expiredFeeWindowRow));
                      });
                    }
                    if (newActiveFeeWindowRows != null) {
                      newActiveFeeWindowRows.forEach((newActiveFeeWindowRow) => {
                        augurEmitter.emit("FeeWindowOpened", Object.assign({
                            eventName: "FeeWindowOpened",
                            blockNumber,
                            timestamp,
                          },
                          newActiveFeeWindowRow));
                      });
                      return callback(null, {
                        newActiveFeeWindows: _.map(newActiveFeeWindowRows, (row) => row.feeWindow),
                        expiredFeeWindows: _.map(expiredFeeWindowRows, (row) => row.feeWindow),
                      });
                    }
                  },
                );
            });
        });
    });
}

export function rollbackMarketState(db: Knex, marketId: Address, expectedState: ReportingState, callback: AsyncCallback): void {
  db("market_state").delete().where({
    marketStateId: queryCurrentMarketStateId(db, marketId),
    reportingState: expectedState,
  }).asCallback((err: Error|null, rowsAffected: number) => {
    if (rowsAffected === 0) return callback(new Error(`Unable to rollback market "${marketId}" from reporting state "${expectedState}" because it is not the most current state`));
    setMarketStateToLatest(db, marketId, callback);
  });
}

export function insertPayout(db: Knex, marketId: Address, payoutNumerators: Array<string|number|null>, invalid: boolean, tentativeWinning: boolean, callback: (err: Error|null, payoutId?: number) => void): void {
  const payoutRow: { [index: string]: string|number|boolean|null } = {
    marketId,
    isInvalid: invalid,
  };
  payoutNumerators.forEach((value, i): void => {
    if (value == null) return;
    payoutRow["payout" + i] = new BigNumber(value, 10).toFixed();
  });
  db.select("payoutId").from("payouts").where(payoutRow).first().asCallback((err: Error|null, payoutIdRow?: { payoutId: number }|null): void => {
    if (err) return callback(err);
    if (payoutIdRow != null) {
      return callback(null, payoutIdRow.payoutId);
    } else {
      const payoutRowWithTentativeWinning = Object.assign({},
        payoutRow,
        { tentativeWinning },
      );
      db.insert(payoutRowWithTentativeWinning).into("payouts").asCallback((err: Error|null, payoutIdRow?: Array<number>): void => {
        if (err) return callback(err);
        if (!payoutIdRow || !payoutIdRow.length) return callback(new Error("No payoutId returned"));
        callback(err, payoutIdRow[0]);
      });
    }
  });
}

export function updateDisputeRound(db: Knex, marketId: Address, callback: ErrorCallback) {
  db("markets").update({
    disputeRounds: db.count("* as completedRounds").from("crowdsourcers").where({ completed: 1, marketId }),
  }).where({ marketId }).asCallback(callback);
}

export function refreshMarketMailboxEthBalance(db: Knex, augur: Augur, marketId: Address, callback: ErrorCallback) {
  db("markets").first("marketCreatorMailbox").where({ marketId }).asCallback((err, marketCreatorMailboxRow?: {marketCreatorMailbox: Address}) => {
    if (err) return callback(err);
    if (!marketCreatorMailboxRow) return callback(new Error("Could not get market creator mailbox"));
    augur.rpc.eth.getBalance([marketCreatorMailboxRow.marketCreatorMailbox, "latest"], (err: Error|null, mailboxBalanceResponse: string): void => {
      if (err) return callback(err);
      const mailboxBalance = new BigNumber(mailboxBalanceResponse, 16);
      db("markets").update("marketCreatorFeesBalance", mailboxBalance.toFixed()).where({ marketId }).asCallback(callback);
    });
  });
}
