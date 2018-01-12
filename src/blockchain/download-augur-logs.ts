import { Augur } from "augur.js";
import { eachSeries } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { ErrorCallback, FormattedEventLog } from "../types";
import { processLog } from "./process-logs";
import { logProcessors } from "./log-processors";
import { processBlockByNumber } from "./process-block";

export function downloadAugurLogs(db: Knex, augur: Augur, fromBlock: number, toBlock: number, callback: ErrorCallback): void {
  console.log("Getting Augur logs from block " + fromBlock + " to block " + toBlock);
  augur.events.getAllAugurLogs({ fromBlock, toBlock }, (err?: string|object|null, allAugurLogs?: Array<FormattedEventLog>): void => {
    if (err) return callback(err instanceof Error ? err : new Error(JSON.stringify(err)));
    const blockNumbers = allAugurLogs!.reduce( (set, log) => set.add(log.blockNumber), new Set<number>() );
    eachSeries(Array.from(blockNumbers), (blockNumber: number, nextBlock: ErrorCallback): void => processBlockByNumber(db, augur, blockNumber, nextBlock) );
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
