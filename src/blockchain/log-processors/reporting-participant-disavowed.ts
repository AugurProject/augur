import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";

export async function processReportingParticipantDisavowedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const initialReporter = await db("initial_reports").update("disavowed", 1).where({ initialReporter: log.reportingParticipant });
    const crowdsourcer = await db("crowdsourcers").update("disavowed", 1).where({ crowdsourcerId: log.reportingParticipant });
    if (initialReporter === 1) {
      augurEmitter.emit(SubscriptionEventNames.ReportingParticipantDisavowed, Object.assign({ type: "initialReporter" }, log));
    } else if (crowdsourcer === 1) {
      augurEmitter.emit(SubscriptionEventNames.ReportingParticipantDisavowed, Object.assign({ type: "crowdsourcer" }, log));
    } else {
      throw new Error(`No reporting participant ${log.reportingParticpant}`);
    }
  };
}

export async function processReportingParticipantDisavowedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const initialReporter = await db("initial_reports").update("disavowed", 0).where({ initialReporter: log.reportingParticipant });
    const crowdsourcer = await db("crowdsourcers").update("disavowed", 0).where({ crowdsourcerId: log.reportingParticipant });
    if (initialReporter === 1) {
      augurEmitter.emit(SubscriptionEventNames.ReportingParticipantDisavowed, Object.assign({ type: "initialReporter" }, log));
    } else if (crowdsourcer === 1) {
      augurEmitter.emit(SubscriptionEventNames.ReportingParticipantDisavowed, Object.assign({ type: "crowdsourcer" }, log));
    } else {
      throw new Error(`No reporting participant ${log.reportingParticpant}`);
    }
  };
}
