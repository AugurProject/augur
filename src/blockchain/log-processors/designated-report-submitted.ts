import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedLog, ErrorCallback } from "../../types";

export function processDesignatedReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
    // @achapman: "The designated reporter purchases Stake Tokens in order to do the Designated Report"
    // TODO: Should designatedReportSubmitted include StakedToken address?

    //  phase:null = no report submitted
    //  phase:0 = designated report submitted
    //  phase:1 = round1
    //  phase:2 = round2
    const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
        marketID: log.market,
        phase: 0,
        isDisputed: false,
        blockNumber: log.blockNumber,
    };

    db.transacting(trx).insert(marketStateDataToInsert).returning("marketStateID").into("market_state").asCallback((err: Error|null, marketStateID?: Array<number>): void => {
        if (err) return callback(err);
        if (!marketStateID || !marketStateID.length) return callback(new Error("Failed to generate new marketStateID for marketID:" + log.market));
        const newMarketStateID = marketStateID[0];
        db("markets").transacting(trx).update({ marketStateID: newMarketStateID }).where("marketID", log.market).asCallback((err: Error|null): void => {
            if (err) return callback(err);
            const dataToInsert: { [index: string]: string|number } = {
                marketID: log.market,
            };
            log.payoutNumerators.forEach((value: number, i: number): void => {
                dataToInsert["payout" + i] = value;
            });
            db.transacting(trx).insert(dataToInsert).into("reports_designated").asCallback(callback);
        });
    });
}
