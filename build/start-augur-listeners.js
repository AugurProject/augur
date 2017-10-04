"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_processors_1 = require("./log-processors");
const log_error_1 = require("./log-error");
function startAugurListeners(db, augur, callback) {
    augur.filters.startListeners({
        Augur: {
            MarketCreated: (log) => {
                console.log("MarketCreated", log);
                log_processors_1.logProcessors.Augur.MarketCreated(db, log, log_error_1.logError);
            },
            TokensTransferred: (log) => {
                console.log("TokensTransferred", log);
                log_processors_1.logProcessors.Augur.TokensTransferred(db, log, log_error_1.logError);
            }
        }
    }, (blockNumber) => {
        augur.rpc.eth.getBlockByNumber([blockNumber, false], (block) => {
            if (!block || block.error || !block.timestamp)
                return log_error_1.logError(new Error(JSON.stringify(block)));
            console.log("new block received:", parseInt(blockNumber, 16), parseInt(block.timestamp, 16));
            const dataToInsertOrReplace = [parseInt(blockNumber, 16), parseInt(block.timestamp, 16)];
            db.run(`INSERT OR REPLACE INTO blocks (block_number, block_timestamp) VALUES (?, ?)`, dataToInsertOrReplace, log_error_1.logError);
        });
    }, callback);
}
exports.startAugurListeners = startAugurListeners;
//# sourceMappingURL=start-augur-listeners.js.map