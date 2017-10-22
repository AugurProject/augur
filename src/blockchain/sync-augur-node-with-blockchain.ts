import Augur from "augur.js";
import * as Knex from "knex";
import { EthereumNodeEndpoints, UploadBlockNumbers, FormattedLog, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

interface HighestBlockNumberRow {
  highestBlockNumber: number;
}

export function syncAugurNodeWithBlockchain(db: Knex,  augur: Augur, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect({ ethereumNode: ethereumNodeEndpoints }, (): void => {
    console.log("Waiting for first block...");
    startAugurListeners(db, augur, (blockNumber: string): void => {
      db.max("block as highestBlockNumber").from(function(this: Knex.QueryBuilder): void {
        this.max("highestBlockNumber as block").from("blockchain_sync_history").unionAll(function(this: Knex.QueryBuilder): void {
          this.max("blockNumber as block").from("blocks");
        }).as("maxBlocks");
      }).asCallback( (err: Error|null, rows?: Array<HighestBlockNumberRow>): void => {
          if (err) return callback(err);
          const row: HighestBlockNumberRow = rows![0];
          const fromBlock: number = (!row || !row.highestBlockNumber) ? uploadBlockNumbers[augur.rpc.getNetworkID()] : row.highestBlockNumber + 1;
          const highestBlockNumber: number = parseInt(blockNumber, 16) - 1;
          if (fromBlock >= highestBlockNumber) return callback(null); // augur-node is already up-to-date
          downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err?: Error|null): void => {
            if (err) return callback(err);
            db.insert({highestBlockNumber}).into("blockchain_sync_history").asCallback(callback);
          });
        });
    });
  });
}
