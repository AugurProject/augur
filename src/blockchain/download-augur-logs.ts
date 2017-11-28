import { Augur } from "augur.js";
import { eachSeries } from "async";
import * as Knex from "knex";
import { ErrorCallback, FormattedEventLog } from "../types";
import { processLog } from "./process-logs";
import { logProcessors } from "./log-processors";

export function downloadAugurLogs(db: Knex, augur: Augur, fromBlock: number, toBlock: number, callback: ErrorCallback): void {
  console.log("Getting Augur logs from block " + fromBlock + " to block " + toBlock);
  augur.events.getAllAugurLogs({ fromBlock, toBlock }, (err?: string|object|null, allAugurLogs?: Array<FormattedEventLog>): void => {
    if (err) return callback(err instanceof Error ? err : new Error(JSON.stringify(err)));
    eachSeries(allAugurLogs!, (log: FormattedEventLog, nextLog: ErrorCallback) => {
      const contractName = log.contractName;
      const eventName = log.eventName;
      if (logProcessors[contractName] == null || logProcessors[contractName][eventName] == null) {
        console.log("Log processor does not exist:", contractName, eventName);
        nextLog();
      } else {
        db.transaction((trx: Knex.Transaction): void => {
          processLog(db, augur, trx, log, logProcessors[contractName][eventName], (err?: Error|null): void => {
            if (err) {
              trx.rollback(err);
              nextLog(err);
            } else {
              trx.commit();
              nextLog();
            }
          });
        });
      }
    }, callback);
  });
}
