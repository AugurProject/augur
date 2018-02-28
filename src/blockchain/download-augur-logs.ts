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
    if (!allAugurLogs) return callback(null);
    const blockNumbers = allAugurLogs.reduce((set, log) => set.add(log.blockNumber), new Set<number>());
    const logsByBlock: { [blockNumber: number]: Array<FormattedEventLog> } = _.groupBy(allAugurLogs, (log) => log.blockNumber);
    eachSeries(Array.from(blockNumbers), (blockNumber: number, nextBlock: ErrorCallback) => {
      const logs = logsByBlock[blockNumber];
      db.transaction((trx: Knex.Transaction): void => {
        processBlockByNumber(trx, augur, blockNumber, (err: Error|null) => {
          if (err) {
            return nextBlock(err);
          }
          eachSeries(logs, (log: FormattedEventLog, nextLog: ErrorCallback) => {
            const contractName = log.contractName;
            const eventName = log.eventName;
            if (logProcessors[contractName] == null || logProcessors[contractName][eventName] == null) {
              console.log("Log processor does not exist:", contractName, eventName);
              nextLog();
            } else {
              processLog(trx, augur, log, logProcessors[contractName][eventName], nextLog);
            }
          }, (err: Error|null) => {
            if (err) {
              trx.rollback(err);
              return nextBlock(err);
            } else {
              trx.commit();
              return nextBlock();
            }
          });
        });
      });
    }, callback);
  });
}
