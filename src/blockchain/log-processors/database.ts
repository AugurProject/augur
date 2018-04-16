import * as Knex from "knex";
import { Address, ReportingState, AsyncCallback } from "../../types";
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

export function updateMarketFeeWindow(db: Knex, universe: Address, marketId: Address, timestamp: number, callback: AsyncCallback) {
  db("fee_windows").first().select("feeWindow").where({ universe }).where("endTime", ">", timestamp).where("startTime", "<=", timestamp)
    .asCallback((err, feeWindowRow?: { feeWindow: Address }) => {
      if (err) return callback(err);
      if (feeWindowRow == null) {
        // Will only occur in false time environments, due to a FeeWindow being Created after block which it applies to
        // TODO: Remove once we feel comfortable with FeeWindow behavior
        console.warn(`Time moved too fast, could not find feeWindow for ${universe} @ ${timestamp}`);
        return callback(null);
      }
      const feeWindow = feeWindowRow.feeWindow;
      db("markets").update({ feeWindow }).where({ marketId }).asCallback(callback);
    });
}

export function updateMarketFeeWindowNext(db: Knex, augur: Augur, universe: Address, marketId: Address, callback: AsyncCallback) {
  return updateMarketFeeWindow(db, universe, marketId, getCurrentTime() + augur.constants.CONTRACT_INTERVAL.DISPUTE_ROUND_DURATION_SECONDS, callback);
}

export function updateMarketFeeWindowCurrent(db: Knex, universe: Address, marketId: Address, callback: AsyncCallback) {
  return updateMarketFeeWindow(db, universe, marketId, getCurrentTime(), callback);
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
  db("fee_windows").select("feeWindow")
    .where("isActive", 1)
    .andWhere((queryBuilder) => queryBuilder.where("endTime", "<", timestamp).orWhere("startTime", ">", timestamp))
    .asCallback((err, results?: Array<{ feeWindow: Address }>) => {
      if (err) return callback(err);
      const expiredFeeWindows = _.map(results, (result) => result.feeWindow);
      db("fee_windows").update("isActive", 0).whereIn("feeWindow", expiredFeeWindows).asCallback((err) => {
        if (err) return callback(err);
        db("fee_windows").select("feeWindow")
          .where("isActive", 0)
          .where("endTime", ">", timestamp)
          .where("startTime", "<", timestamp)
          .asCallback((err, results?: Array<{ feeWindow: Address }>) => {
            if (err) return callback(err);
            const newActiveFeeWindows = _.map(results, (result) => result.feeWindow);
            db("fee_windows").update("isActive", 1).whereIn("feeWindow", newActiveFeeWindows).asCallback((err) => {
              if (err) return callback(err);
              expiredFeeWindows.forEach((expiredFeeWindow) => {
                augurEmitter.emit("FeeWindowClosed", { feeWindowId: expiredFeeWindow, blockNumber, timestamp });
              });
              newActiveFeeWindows.forEach((newActiveFeeWindow) => {
                augurEmitter.emit("FeeWindowOpened", { feeWindowId: newActiveFeeWindow, blockNumber, timestamp });
              });
              return callback(null, { newActiveFeeWindows, expiredFeeWindows });
            });
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
        if (err) callback(err);
        if (!payoutIdRow || !payoutIdRow.length) return callback(new Error("No payoutId returned"));
        callback(err, payoutIdRow[0]);
      });
    }
  });
}
