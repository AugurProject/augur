import { Augur, FormattedEventLog } from "../../types";
import Knex from "knex";
import {
  advanceDisputeWindowActive,
  getCurrentTime,
  removeOverrideTimestamp,
  setOverrideTimestamp
} from "../process-block";

export async function processTimestampSetLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await setOverrideTimestamp(db, parseInt(log.newTimestamp, 10));
    return advanceDisputeWindowActive(db, augur, log.blockNumber, log.newTimestamp);
  };
}

export async function processTimestampSetLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await removeOverrideTimestamp(db, parseInt(log.newTimestamp, 10));
    return advanceDisputeWindowActive(db, augur, log.blockNumber, getCurrentTime());
  };
}
