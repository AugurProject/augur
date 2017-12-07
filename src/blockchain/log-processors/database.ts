import * as Knex from "knex";
import BigNumber from "bignumber.js";
import { Address, ReportingState, AsyncCallback } from "../../types";

export function updateMarketState(db: Knex, marketID: Address, blockNumber: number, reportingState: ReportingState , callback: AsyncCallback) {
  const marketStateDataToInsert = { marketID, reportingState, blockNumber };
  db.insert(marketStateDataToInsert).returning("marketStateID").into("market_state").asCallback((err: Error|null, marketStateID?: Array<number>): void => {
    if (err) return callback(err);
    if (!marketStateID || !marketStateID.length) return callback(new Error("Failed to generate new marketStateID for marketID:" + marketID));
    db("markets").update({ marketStateID: marketStateID[0] }).where("marketID", marketID).asCallback(callback);
  });
}
