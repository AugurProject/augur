import Augur from "augur.js";
import * as Knex from "knex";
import { EthereumNodeEndpoints, UploadBlockNumbers, FormattedLog, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

interface HighestBlockNumberRow {
  highestBlockNumber: number;
}

interface NetworkIDRow {
  networkID: string;
}

function getNetworkID(db: Knex, augur: Augur, callback: (err: Error|null, networkID: string|null) => void) {
  const networkID:string = augur.rpc.getNetworkID();
  db.select("networkID").from("network_id").limit(1).asCallback( (err: Error|null, rows: Array<NetworkIDRow>): void => {
      if (rows.length == 0) {
        db.insert({networkID}).into("network_id").asCallback( (err: Error|null): void => {
          callback(err, networkID);
        });
      } else {
        const lastNetworkID: string = rows[0].networkID;
        if (networkID == lastNetworkID) {
          db("network_id").update({lastLaunched: db.fn.now()}).asCallback( (err: Error|null): void => callback(err, networkID) );
        } else {
          callback(new Error(`NetworkID mismatch: current: ${networkID}, expected ${lastNetworkID}`), networkID);
        }
      }
  })
}

export function syncAugurNodeWithBlockchain(db: Knex,  augur: Augur, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect({ ethereumNode: ethereumNodeEndpoints }, (): void => {
    console.log("Waiting for first block...");
    startAugurListeners(db, augur, (blockNumber: string): void => {
      getNetworkID(db, augur, (err: Error|null, networkID: string|null) => {
        if (err) {
          augur.events.stopListeners();
          callback(err);
          return;
        }
        db.max("block as highestBlockNumber").from(function(this: Knex.QueryBuilder): void {
          this.max("highestBlockNumber as block").from("blockchain_sync_history").unionAll(function(this: Knex.QueryBuilder): void {
            this.max("blockNumber as block").from("blocks");
          }).as("maxBlocks");
        }).asCallback( (err: Error|null, rows?: Array<HighestBlockNumberRow>): void => {
            if (err) return callback(err);
            const row: HighestBlockNumberRow = rows![0];
            const fromBlock: number = (!row || !row.highestBlockNumber) ? uploadBlockNumbers[networkID!] : row.highestBlockNumber + 1;
            const highestBlockNumber: number = parseInt(blockNumber, 16) - 1;
            if (fromBlock >= highestBlockNumber) return callback(null); // augur-node is already up-to-date
            downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err?: Error|null): void => {
              if (err) return callback(err);
              db.insert({highestBlockNumber}).into("blockchain_sync_history").asCallback(callback);
            });
          });
        });
    });
  });
}
