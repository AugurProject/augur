import Augur = require("augur.js");
import * as Knex from "knex";
import { EthereumNodeEndpoints, UploadBlockNumbers, FormattedLog, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

export function syncAugurNodeWithBlockchain(db: Knex, augur: Augur, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect(ethereumNodeEndpoints, () => startAugurListeners(db, augur, () => {
    db.raw(`SELECT highest_block_number FROM blockchain_sync_history ORDER BY highest_block_number DESC LIMIT 1`)
      .asCallback( (err: Error|null, row?: {highest_block_number:number}) => {
        if(err) return callback(err);
        const fromBlock: number = (!row || !row.highest_block_number) ? uploadBlockNumbers[augur.rpc.getNetworkID()] : row.highest_block_number + 1;
        const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16);
        if (fromBlock >= highestBlockNumber) return callback(null); // augur-node is already up-to-date
        downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err?: Error|null) => {
          if (err) return callback(err);
          db.raw(`INSERT INTO blockchain_sync_history (highest_block_number) VALUES (?)`, [highestBlockNumber]).asCallback(callback);
        });
      })
  }));
}
