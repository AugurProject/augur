"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processOrderCreatedLog(db, log, callback) {
    db.get(`SELECT block_timestamp FROM blocks WHERE block_number = ?`, [log.blockNumber], (err, blocksRow) => {
        if (err)
            return callback(err);
        if (!blocksRow)
            return callback(new Error("block timestamp not found"));
        db.get(`SELECT market_id, outcome FROM tokens WHERE contract_address = ?`, [log.shareToken], (err, tokensRow) => {
            if (err)
                return callback(err);
            if (!tokensRow)
                return callback(new Error("market and outcome not found"));
            const dataToInsert = [
                log.orderId, tokensRow.market_id, tokensRow.outcome, log.shareToken, log.orderType, log.creator, blocksRow.block_timestamp, log.blockNumber, log.price, log.amount, log.tokensEscrowed, log.sharesEscrowed, log.tradeGroupId
            ];
            db.run(`INSERT INTO orders
        (order_id, market_id, outcome, share_token, order_type, creator, creation_time, creation_block_number, price, amount, tokens_escrowed, shares_escrowed, trade_group_id)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        });
    });
}
exports.processOrderCreatedLog = processOrderCreatedLog;
//# sourceMappingURL=order-created.js.map