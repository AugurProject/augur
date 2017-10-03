import Augur = require("augur.js");
import { each } from "async";
import { Database } from "sqlite3";
import { AugurLogs, ErrorCallback } from "./types";
import { processLogs } from "./process-logs";
import { logProcessors } from "./log-processors";

export function downloadAugurLogs(db: Database, augur: Augur, fromBlock: number, toBlock: number, callback: ErrorCallback): void {
  augur.logs.getAllAugurLogs({ fromBlock, toBlock }, (err: string|Object, allAugurLogs?: AugurLogs) => {
    if (err) return callback(err instanceof Error ? err : new Error(JSON.stringify(err)));
    each(Object.keys(allAugurLogs!), (contractName: string, nextContractName: ErrorCallback) => (
      each(Object.keys(allAugurLogs![contractName]!), (eventName: string, nextEventName: ErrorCallback) => (
        processLogs(db, allAugurLogs![contractName]![eventName]!, logProcessors[contractName][eventName], callback)
      ), nextContractName)
    ), callback);
  });
}
