import { AugurJs, SqlLiteDb, EthereumNodeEndpoints, UploadBlockNumbers, FormattedLog, ErrorCallback } from "./types";
import { startAugurListeners } from "./start-augur-listeners";
import { downloadAugurLogs } from "./download-augur-logs";

export function syncAugurNodeWithBlockchain(db: SqlLiteDb, augur: AugurJs, ethereumNodeEndpoints: EthereumNodeEndpoints, uploadBlockNumbers: UploadBlockNumbers, callback: ErrorCallback): void {
  augur.connect(ethereumNodeEndpoints, () => startAugurListeners(db, augur, () => {
    const highestBlockNumber: number = parseInt(augur.rpc.getCurrentBlock().number, 16);
    downloadAugurLogs(db, augur, uploadBlockNumbers, highestBlockNumber, (err?: Error|null) => {
      if (err) return callback(err);
      db.run(`INSERT INTO blockchain_sync_history (highest_block_number) VALUES (?)`, [highestBlockNumber], callback);
    });
  }));
}
