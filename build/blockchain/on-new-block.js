"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_error_1 = require("../utils/log-error");
function onNewBlock(db, augur, blockNumber) {
    augur.rpc.eth.getBlockByNumber([blockNumber, false], (block) => {
        if (!block || block.error || !block.timestamp)
            return log_error_1.logError(new Error(JSON.stringify(block)));
        console.log("new block:", parseInt(blockNumber, 16), parseInt(block.timestamp, 16));
        const dataToInsertOrReplace = [parseInt(blockNumber, 16), parseInt(block.timestamp, 16)];
        db.run(`INSERT OR REPLACE INTO blocks (block_number, block_timestamp) VALUES (?, ?)`, dataToInsertOrReplace, log_error_1.logError);
    });
}
exports.onNewBlock = onNewBlock;
//# sourceMappingURL=on-new-block.js.map