import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, FeeWindowRow } from "../../types";
import { augurEmitter } from "../../events";
import { insertPayout } from "./database";

export function processDisputeCrowdsourcerCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  insertPayout(db, trx, log.market, log.payoutNumerators, log.invalid, (err, payoutID) => {
    if (err) return callback(err);
    trx("fee_windows").select(["feeWindow"]).first()
      .whereNull("endBlockNumber")
      .where({ universe: log.universe })
      .orderBy("startTime", "ASC")
      .asCallback((err: Error|null, feeWindowRow?: {feeWindow: string}|null): void => {
      if (err) return callback(err);
      if (feeWindowRow == null) return callback(new Error(`could not retrieve feeWindow for crowdsourcer: ${log.disputeCrowdsourcer}`));
      const crowdsourcerToInsert = {
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        crowdsourcerID: log.disputeCrowdsourcer,
        marketID: log.market,
        feeWindow: feeWindowRow.feeWindow,
        size: log.size,
        payoutID,
        completed: null,
      };
      db.transacting(trx).insert(crowdsourcerToInsert).into("crowdsourcers").returning("crowdsourcerID").asCallback((err: Error|null): void => {
        if (err) return callback(err);
        augurEmitter.emit("DisputeCrowdsourcerCreated", log);
        callback(null);
      });
    });
  });

}

export function processDisputeCrowdsourcerCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("crowdsourcers").where("crowdsourcerID", log.disputeCrowdsourcer).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("DisputeCrowdsourcerCreated", log);
    callback(null);
  });
}

export function processDisputeCrowdsourcerContributionLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  const disputeToInsert = {
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
    reporter: log.reporter,
    crowdsourcerID: log.disputeCrowdsourcer,
    amountStaked: log.amountStaked,
  };
  db.transacting(trx).insert(disputeToInsert).into("disputes").asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.transacting(trx).update("amountStaked", db.raw(`amountStaked + ${log.amountStaked}`)).into("crowdsourcers").where("crowdsourcerID", log.disputeCrowdsourcer).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerContribution", log);
      callback(null);
    });
  });
}

export function processDisputeCrowdsourcerContributionLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db.transacting(trx).from("disputes").where({
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  }).del().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.transacting(trx).update("amountStaked", db.raw(`amountStaked - ${log.amountStaked}`)).into("crowdsourcers").where("crowdsourcerID", log.disputeCrowdsourcer).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerContribution", log);
      callback(null);
    });
  });
}

// event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer);
export function processDisputeCrowdsourcerCompletedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").transacting(trx).update({ completed: 1 }).where({ crowdsourcerID: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
    callback(null);
  });
}

export function processDisputeCrowdsourcerCompletedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").transacting(trx).update({ completed: 0 }).where({ crowdsourcerID: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
    callback(null);
  });
}
