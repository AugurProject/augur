import Augur from "augur.js";
import { eachSeries } from "async";
import * as Knex from "knex";
import { AugurLogs, ErrorCallback } from "../types";
import { processLogs } from "./process-logs";
import { logProcessors } from "./log-processors";

export function downloadAugurLogs(db: Knex, augur: Augur, fromBlock: number, toBlock: number, callback: ErrorCallback): void {
  console.log("Getting Augur logs from block " + fromBlock + " to block " + toBlock);
  augur.events.getAllAugurLogs({ fromBlock, toBlock }, (err?: string|object|null, allAugurLogs?: AugurLogs): void => {
    if (err) return callback(err instanceof Error ? err : new Error(JSON.stringify(err)));
    eachSeries(Object.keys(allAugurLogs!), (contractName: string, nextContractName: ErrorCallback) => (
      eachSeries(Object.keys(allAugurLogs![contractName]!), (eventName: string, nextEventName: ErrorCallback) => (
        db.transaction((trx: Knex.Transaction): void => {
          processLogs(db, augur, trx, allAugurLogs![contractName]![eventName]!, logProcessors[contractName][eventName], (err?: Error|null): void => {
            if (err) {
              trx.rollback();
              nextEventName(err);
            } else {
              trx.commit();
              nextEventName();
            }
          });
        })
      ), nextContractName)
    ), callback);
  });
}
