import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog } from "../../types";
import { advanceFeeWindowActive, getCurrentTime, removeOverrideTimestamp, setOverrideTimestamp } from "../process-block";

export async function processTimestampSetLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await setOverrideTimestamp(db, parseInt(log.newTimestamp, 10));
    return advanceFeeWindowActive(db, augur, log.blockNumber, log.newTimestamp);
  };
}

export async function processTimestampSetLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await removeOverrideTimestamp(db, parseInt(log.newTimestamp, 10));
    return advanceFeeWindowActive(db, augur, log.blockNumber, getCurrentTime());
  };
}
