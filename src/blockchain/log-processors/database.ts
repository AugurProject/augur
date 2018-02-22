import * as Knex from "knex";
import { Address, ReportingState, AsyncCallback } from "../../types";

export function updateMarketState(db: Knex, marketID: Address, blockNumber: number, reportingState: ReportingState , callback: AsyncCallback) {
  const marketStateDataToInsert = { marketID, reportingState, blockNumber };
  db.insert(marketStateDataToInsert).returning("marketStateID").into("market_state").asCallback((err: Error|null, marketStateID?: Array<number>): void => {
    if (err) return callback(err);
    if (!marketStateID || !marketStateID.length) return callback(new Error("Failed to generate new marketStateID for marketID:" + marketID));
    db("markets").update({ marketStateID: marketStateID[0] }).where("marketID", marketID).asCallback(callback);
  });
}

export function insertPayout(db: Knex, marketID: Address, payoutNumerators: Array<string|number|null>, invalid: boolean, tentativeWinning: boolean, callback: (err: Error|null, payoutID?: number) => void): void {
  const payoutRow: { [index: string]: string|number|boolean|null } = {
    marketID,
    isInvalid: invalid,
    tentativeWinning,
  };
  payoutNumerators.forEach((value: number, i: number): void => {
    payoutRow["payout" + i] = value;
  });
  db.select("payoutID").from("payouts").where(payoutRow).first().asCallback( (err: Error|null, payoutID?: number|null): void => {
    if (err) return callback(err);
    if (payoutID != null) {
      return callback(null, payoutID);
    } else {
      db.insert(payoutRow).returning("payoutID").into("payouts").asCallback((err: Error|null, payoutIDRow?: Array<number>): void => {
        if (err) callback(err);
        if (!payoutIDRow || !payoutIDRow.length) return callback(new Error("No payoutID returned"));
        callback(err, payoutIDRow[0]);
      });
    }
  });
}
