import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";
import { insertPayout } from "./database";

export function processDisputeCrowdsourcerCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  insertPayout( db, trx, log.market, log.payoutNumerators, log.invalid, (err, payoutID) => {
    const crowdsourcerToInsert = {
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      crowdsourcerID: log.disputeCrowdsourcer,
      marketID: log.market,
      payoutID,
    };
    db.transacting(trx).insert(crowdsourcerToInsert).into("crowdsourcers").returning("crowdsourcerID").asCallback(callback);
    augurEmitter.emit("DisputeCrowdsourcerCreated", log);
  });
}

export function processDisputeCrowdsourcerCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("DisputeCrowdsourcerCreated", log);
  db.transacting(trx).from("crowdsourcers").where("crowdsourcerID", log.disputeCrowdsourcer).del().asCallback(callback);
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
  db.transacting(trx).insert(disputeToInsert).into("disputes").asCallback(callback);
  augurEmitter.emit("DisputeCrowdsourcerContribution", log);
}

export function processDisputeCrowdsourcerContributionLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("DisputeCrowdsourcerContribution", log);
  db.transacting(trx).from("disputes").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback(callback);
}

// event DisputeCrowdsourcerCompleted(address indexed universe, address indexed market, address disputeCrowdsourcer);
export function processDisputeCrowdsourcerCompletedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerCompleted");
  console.log(log);
  callback(null);
}

export function processDisputeCrowdsourcerCompletedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerCompleted removal");
  console.log(log);
  augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
  callback(null);
}
