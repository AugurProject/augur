import Augur from "augur.js";
import * as Knex from "knex";
import { EthereumNodeEndpoints, UploadBlockNumbers, FormattedEventLog, ErrorCallback, Block } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

interface HighestBlockNumberRow {
  highestBlockNumber: number;
}

interface NetworkIDRow {
  networkID: string;
}

function getNetworkID(db: Knex, augur: Augur, callback: (err: Error|null, networkID: string|null) => void) {
  const networkID: string = augur.rpc.getNetworkID();
  db.select("networkID").from("network_id").limit(1).asCallback( (err: Error|null, rows: Array<NetworkIDRow>): void => {
    if (rows.length === 0) {
      db.insert({networkID}).into("network_id").asCallback( (err: Error|null): void => {
        callback(err, networkID);
      });
    } else {
      const lastNetworkID: string = rows[0].networkID;
      if (networkID === lastNetworkID) {
        db("network_id").update({lastLaunched: db.fn.now()}).asCallback( (err: Error|null): void => callback(err, networkID) );
      } else {
        callback(new Error(`NetworkID mismatch: current: ${networkID}, expected ${lastNetworkID}`), networkID);
      }
    }
  });
}

export function syncAugurNodeWithBlockchain(db: Knex,  augur: Augur, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect({ ethereumNode: ethereumNodeEndpoints }, (): void => {
    startAugurListeners(db, augur, (err: Error|null): void => {
      if (err) return callback(err);
      console.log("Started blockchain event listeners", augur.rpc.getCurrentBlock());
      getNetworkID(db, augur, (err: Error|null, networkID: string|null) => {
        if (err) return callback(err);
        db("blockchain_sync_history").max("blockNumber as highestBlockNumber").asCallback((err: Error|null, rows?: Array<HighestBlockNumberRow>): void => {
          if (err) return callback(err);
          if (!rows || !rows.length || !rows[0]) return callback(new Error("blockchain_sync_history lookup failed"));
          const row: HighestBlockNumberRow = rows[0];
          if (row.highestBlockNumber === null) { // sync from scratch
            const fromBlock = uploadBlockNumbers[networkID!];
            const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16) - 1;
            if (fromBlock >= highestBlockNumber) return callback(null); // augur-node is already up-to-date
            downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err?: Error|null): void => {
              if (err) return callback(err);
              db.insert({ highestBlockNumber }).into("blockchain_sync_history").asCallback(callback);
            });
          } else {
            callback(new Error("Please clear your augur.db and start over (must sync from scratch until issue #4386 is resolved)"));
          }
        });
      });
    });
  });
}
