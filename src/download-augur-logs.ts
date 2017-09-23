import { each } from "async";
import { AugurJs, SqlLiteDb, AugurLogs } from "./types";
import { processLogs } from "./process-logs";
import { logProcessors } from "./log-processors";

const UPLOAD_BLOCK_NUMBER: {[networkID: string]: number} = {
  "1": 4086425, // Mainnet (network 1)
  "3": 1377804, // Ropsten (network 3)
  "4": 590387   // Rinkeby (network 4)
};

export function downloadAugurLogs(db: SqlLiteDb, augur: AugurJs, callback: (err?: Error|null) => void): void {
  const fromBlock: number = UPLOAD_BLOCK_NUMBER[augur.rpc.getNetworkID()];
  augur.logs.getAllAugurLogs({ fromBlock }, (err: string|null, allAugurLogs?: AugurLogs) => {
    if (err) return callback(new Error(JSON.stringify(err)));
    each(Object.keys(allAugurLogs), (contractName: string, nextContractName: (err?: Error|null) => void) => (
      each(Object.keys(allAugurLogs[contractName]), (eventName: string, nextEventName: (err?: Error|null) => void) => (
        processLogs(db, allAugurLogs[contractName][eventName], logProcessors[contractName][eventName], callback)
      ), nextContractName)
    ), callback);
  });
}
