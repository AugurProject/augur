import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, EventLogProcessor } from "../types";

export function processLog(db: Knex, augur: Augur, log: FormattedEventLog, logProcessor: EventLogProcessor) {
  return new Promise((resolve, reject) => {
    (!log.removed ? logProcessor.add : logProcessor.remove)(db, augur, log, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
