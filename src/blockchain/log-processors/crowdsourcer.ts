import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, Address, AsyncCallback } from "../../types";
import { augurEmitter } from "../../events";
import { insertPayout } from "./database";
import { QueryBuilder } from "knex";
import { parallel } from "async";

function updateTentativeWinningPayout(db: Knex, marketID: Address, callback: ErrorCallback) {
  const query = db.first(["payoutID", "amountStaked"]).from((builder: QueryBuilder) =>
    builder.from("crowdsourcers").select("payoutID", "amountStaked").where({
      completed: 1,
      marketID,
    }).union((builder: QueryBuilder) =>
      builder.select(["payoutID", "amountStaked"]).from("initial_reports").where("marketID", marketID),
    )).orderBy("sum(amountStaked)", "desc").groupBy("payoutID");
  query.asCallback((err: Error|null, mostStakedPayoutID) => {
    if (err) return callback(err);
    parallel([
      (next: AsyncCallback) => {
        const query = db("payouts").update("tentativeWinning", 0).where("marketID", marketID);
        if (mostStakedPayoutID != null) query.whereNot("payoutID", mostStakedPayoutID.payoutID);
        query.asCallback(next);
      },
      (next: AsyncCallback) => {
        if (mostStakedPayoutID == null) return next(null);
        db("payouts").update("tentativeWinning", 1).where("marketID", marketID).where("payoutID", mostStakedPayoutID.payoutID).asCallback(next);
      },
    ], callback);
  });
}

export function processDisputeCrowdsourcerCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  insertPayout(db, trx, log.market, log.payoutNumerators, log.invalid, false, (err, payoutID) => {
    if (err) return callback(err);
    trx("fee_windows").select(["feeWindow"]).first()
      .whereNull("endBlockNumber")
      .where({ universe: log.universe })
      .orderBy("startTime", "ASC")
      .asCallback((err: Error|null, feeWindowRow?: { feeWindow: string }|null): void => {
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

export function processDisputeCrowdsourcerCompletedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").transacting(trx).update({ completed: 1 }).where({ crowdsourcerID: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    updateTentativeWinningPayout(trx, log.market, (err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
      callback(null);
    });
  });
}

export function processDisputeCrowdsourcerCompletedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  db("crowdsourcers").transacting(trx).update({ completed: null }).where({ crowdsourcerID: log.disputeCrowdsourcer }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    updateTentativeWinningPayout(trx, log.market, (err: Error|null): void => {
      if (err) return callback(err);
      augurEmitter.emit("DisputeCrowdsourcerCompleted", log);
      callback(null);
    });
  });
}
