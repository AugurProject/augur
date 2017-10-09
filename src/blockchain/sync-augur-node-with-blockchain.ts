import Augur = require("augur.js");
import * as Knex from "knex";
import { EthereumNodeEndpoints, UploadBlockNumbers, FormattedLog, ErrorCallback } from "../types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

export function syncAugurNodeWithBlockchain(db: Knex, augur: Augur, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  db.transaction((trx) => {
    augur.connect({ ethereumNode: ethereumNodeEndpoints }, () => startAugurListeners(db, trx, augur, () => {
      trx.raw(`SELECT highest_block_number FROM blockchain_sync_history ORDER BY highest_block_number DESC LIMIT 1`)
        .asCallback( (err: Error|null, row?: {highest_block_number:number}) => {
          if(err) return callback(err);
          const fromBlock: number = (!row || !row.highest_block_number) ? uploadBlockNumbers[augur.rpc.getNetworkID()] : row.highest_block_number + 1;
          const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16);
          if (fromBlock >= highestBlockNumber) return callback(null); // augur-node is already up-to-date

          downloadAugurLogs(db, trx, augur, fromBlock, highestBlockNumber, (err?: Error|null) => {
            if (err) {
              trx.rollback();
              return callback(err);
            }

            db.transacting(trx).insert({highest_block_number: highestBlockNumber}).into("blockchain_sync_history")
              .catch(trx.rollback)
              .then(trx.commit)
              .then(callback);
          });
        });
    }));
  });
}
