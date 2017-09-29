"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const start_augur_listeners_1 = require("./start-augur-listeners");
const download_augur_logs_1 = require("./download-augur-logs");
function syncAugurNodeWithBlockchain(db, augur, ethereumNodeEndpoints, uploadBlockNumbers, callback) {
    augur.connect(ethereumNodeEndpoints, () => start_augur_listeners_1.startAugurListeners(db, augur, () => {
        db.get(`SELECT highest_block_number FROM blockchain_sync_history ORDER BY highest_block_number DESC LIMIT 1`, (err, row) => {
            if (err)
                return callback(err);
            const fromBlock = (!row || !row.highest_block_number) ? uploadBlockNumbers[augur.rpc.getNetworkID()] : row.highest_block_number + 1;
            const highestBlockNumber = parseInt(augur.rpc.getCurrentBlock().number, 16);
            if (fromBlock >= highestBlockNumber)
                return callback(null); // augur-node is already up-to-date
            download_augur_logs_1.downloadAugurLogs(db, augur, fromBlock, highestBlockNumber, (err) => {
                if (err)
                    return callback(err);
                db.run(`INSERT INTO blockchain_sync_history (highest_block_number) VALUES (?)`, [highestBlockNumber], callback);
            });
        });
    }));
}
exports.syncAugurNodeWithBlockchain = syncAugurNodeWithBlockchain;
//# sourceMappingURL=sync-augur-node-with-blockchain.js.map