import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback, AsyncCallback } from "../../types";
import { parallel } from "async";
import { augurEmitter } from "../../events";

interface ParticipantUpdateResult {
  initialReporter: number;
  crowdsourcer: number;
}

export function processReportingParticipantDisavowedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel({
    initialReporter: (next: AsyncCallback) => db("initial_reports").update("disavowed", 1).where({initialReporter: log.reportingParticipant }).asCallback(next),
    crowdsourcer: (next: AsyncCallback) => db("crowdsourcers").update("disavowed", 1).where({crowdsourcerId: log.reportingParticipant}).asCallback(next),
  }, (err, participantUpdateResult: ParticipantUpdateResult) => {
    if (err) return callback(err);
    if (participantUpdateResult.initialReporter === 1) {
      augurEmitter.emit("ReportingParticipantDisavowed", Object.assign({type: "initialReporter"}, log));
      return callback(null);
    } else if (participantUpdateResult.crowdsourcer === 1) {
      augurEmitter.emit("ReportingParticipantDisavowed", Object.assign({ type: "crowdsourcer" }, log));
      return callback(null);
    } else {
      callback(new Error(`No reporting participant ${log.reportingParticpant}`));
    }
  });
}

export function processReportingParticipantDisavowedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  parallel({
    initialReporter: (next: AsyncCallback) => db("initial_reports").update("disavowed", 0).where({initialReporter: log.reportingParticipant }).asCallback(next),
    crowdsourcer: (next: AsyncCallback) => db("crowdsourcers").update("disavowed", 0).where({crowdsourcerId: log.reportingParticipant}).asCallback(next),
  }, (err, participantUpdateResult: ParticipantUpdateResult) => {
    if (err) return callback(err);
    if (participantUpdateResult.initialReporter === 1) {
      augurEmitter.emit("ReportingParticipantDisavowed", Object.assign({type: "initialReporter"}, log));
      return callback(null);
    } else if (participantUpdateResult.crowdsourcer === 1) {
      augurEmitter.emit("ReportingParticipantDisavowed", Object.assign({ type: "crowdsourcer" }, log));
      return callback(null);
    } else {
      callback(new Error(`No reporting participant ${log.reportingParticpant}`));
    }
  });
}
