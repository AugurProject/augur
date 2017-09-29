import { each } from "async";
import { AugurJs, SqlLiteDb, AugurLogs, UploadBlockNumbers, ErrorCallback } from "./types";
import { processLogs } from "./process-logs";
import { logProcessors } from "./log-processors";

export function downloadAugurLogs(db: SqlLiteDb, augur: AugurJs, uploadBlockNumbers: UploadBlockNumbers, toBlock: number, callback: ErrorCallback): void {
  const fromBlock: number = uploadBlockNumbers[augur.rpc.getNetworkID()];
  augur.logs.getAllAugurLogs({ fromBlock, toBlock }, (err: Object|string|null, allAugurLogs?: AugurLogs) => {
    if (err) return callback(err instanceof Error ? err : new Error(JSON.stringify(err)));
    each(Object.keys(allAugurLogs), (contractName: string, nextContractName: ErrorCallback) => (
      each(Object.keys(allAugurLogs[contractName]), (eventName: string, nextEventName: ErrorCallback) => (
        processLogs(db, allAugurLogs[contractName][eventName], logProcessors[contractName][eventName], callback)
      ), nextContractName)
    ), callback);
  });
}
