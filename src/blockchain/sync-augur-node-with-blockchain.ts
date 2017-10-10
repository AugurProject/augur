import Augur = require("augur.js");
import * as Knex from "knex";
import { EthereumNodeEndpoints, UploadBlockNumbers, FormattedLog, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

interface HighestBlockNumberRow {
  highest_block_number: number;
}

export function syncAugurNodeWithBlockchain(db: Knex,  augur: Augur, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect({ ethereumNode: ethereumNodeEndpoints }, () => {
    console.log("Waiting for first block...");
    startAugurListeners(db, augur, (blockNumber: string) => {
      db.raw(`SELECT highest_block_number FROM blockchain_sync_history ORDER BY highest_block_number DESC LIMIT 1`)
        .asCallback( (err: Error|null, rows?: Array<HighestBlockNumberRow>) => {
          if (err) return callback(err);
          const row: HighestBlockNumberRow = rows![0];
          const fromBlock: number = (!row || !row.highest_block_number) ? uploadBlockNumbers[augur.rpc.getNetworkID()] : row.highest_block_number + 1;
          const highestBlockNumber: number = parseInt(blockNumber, 16);
          if (fromBlock >= highestBlockNumber) return callback(null); // augur-node is already up-to-date

          downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err?: Error|null) => {
            if (err) return callback(err);
            db.insert({highest_block_number: highestBlockNumber}).into("blockchain_sync_history").asCallback(callback);
          });
        });
    });
  });
}
