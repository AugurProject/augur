import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address } from "../../types";

// Ensures stakeToken entry exists in the database. May not need to be inserted, there's no upsert required
export function insertStakeToken(db: Knex, trx: Knex.Transaction, stakeToken: Address, marketID: Address, payoutNumerators: Array<string|number|null>, callback: ErrorCallback): void {
  db.transacting(trx).first("marketID").from("stake_tokens").where({ stakeToken }).asCallback( (err: Error|null, rowMarketID?: string|null|undefined): void => {
    if (err) return callback(err);
    if (rowMarketID != null) {
      return callback((rowMarketID === marketID) ? null : new Error(`StakeToken ${stakeToken} exists, but marketID ${marketID} does not match`));
    } else {
      // Does not exist, proceed with insert
      const stakeTokenRow: { [index: string]: string|number } = {
        marketID,
        stakeToken,
      };
      payoutNumerators.forEach((value: number, i: number): void => {
          stakeTokenRow["payout" + i] = value;
      });
      db.transacting(trx).insert(stakeTokenRow).into("stake_tokens").asCallback(callback);
    }
  });
}

export function processDesignatedReportSubmittedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const marketStateDataToInsert: { [index: string]: string|number|boolean } = {
    marketID: log.market,
    reportingState: augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE,
    blockNumber: log.blockNumber,
  };

  db.transacting(trx).insert(marketStateDataToInsert).returning("marketStateID").into("market_state").asCallback((err: Error|null, marketStateID?: Array<number>): void => {
    if (err) return callback(err);
    if (!marketStateID || !marketStateID.length) return callback(new Error("Failed to generate new marketStateID for marketID:" + log.market));
    const newMarketStateID = marketStateID[0];
    db("markets").transacting(trx).update({ marketStateID: newMarketStateID }).where("marketID", log.market).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      insertStakeToken(db, trx, log.stakeToken, log.market, log.payoutNumerators, (err: Error|null) => {
        if (err) return callback(err);
        db.transacting(trx).insert({marketID: log.market, stakeToken: log.stakeToken}).into("reports_designated").asCallback(callback);
      });
    });
  });
}

export function processDesignatedReportSubmittedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db("market_state").transacting(trx).delete().where({marketID: log.market, reportingState: augur.constants.REPORTING_STATE.DESIGNATED_DISPUTE}).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db("market_state").transacting(trx).max("marketStateID as previousMarketStateID").first().where({marketID: log.market}).asCallback((err: Error|null, {previousMarketStateID }: {previousMarketStateID: number}): void => {
      if (err) return callback(err);
      db("markets").transacting(trx).update({marketStateID: previousMarketStateID}).where({marketID: log.market }).asCallback(callback);
    });
  });
}
