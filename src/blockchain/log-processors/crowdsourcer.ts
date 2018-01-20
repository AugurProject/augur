import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processDisputeCrowdsourcerCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerCreated");
  console.log(log);
  callback(null);
}

export function processDisputeCrowdsourcerCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerCreated removal");
  console.log(log);
  augurEmitter.emit("DisputeCrowdsourcerCreated", log);
  callback(null);
}

export function processDisputeCrowdsourcerContributionLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerContribution");
  console.log(log);
  callback(null);
}

export function processDisputeCrowdsourcerContributionLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  console.log("TODO: DisputeCrowdsourcerContribution removal");
  console.log(log);
  augurEmitter.emit("DisputeCrowdsourcerContribution", log);
  callback(null);
}

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
