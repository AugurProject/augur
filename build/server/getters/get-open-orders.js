"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// market, outcome, creator, orderType, limit, sort
function getOpenOrders(db, marketID, outcome, orderType, creator, callback) {
    const conditions = [{
            name: "market_id",
            value: marketID
        }, {
            name: "outcome",
            value: outcome
        }, {
            name: "order_type",
            value: orderType
        }, {
            name: "order_creator",
            value: creator
        }].filter((condition) => condition.value != null);
    const whereClause = conditions.map((condition) => `${condition.name} = ?`).join(" AND ");
    db.all(`SELECT * FROM orders WHERE ${whereClause}`, conditions.map((condition) => condition.value), (err, ordersRows) => {
        if (err)
            return callback(err);
        if (!ordersRows || !ordersRows.length)
            return callback(null);
        const orders = {};
        ordersRows.forEach((row) => {
            if (!orders[row.market_id])
                orders[row.market_id] = {};
            if (!orders[row.market_id][row.outcome])
                orders[row.market_id][row.outcome] = {};
            if (!orders[row.market_id][row.outcome][row.order_type])
                orders[row.market_id][row.outcome][row.order_type] = {};
            orders[row.market_id][row.outcome][row.order_type][row.order_id] = {
                shareToken: row.share_token,
                orderCreator: row.order_creator,
                creationTime: row.creation_time,
                creationBlockNumber: row.creation_block_number,
                price: row.price,
                amount: row.amount,
                tokensEscrowed: row.tokens_escrowed,
                sharesEscrowed: row.shares_escrowed
            };
        });
        callback(null, orders);
    });
}
exports.getOpenOrders = getOpenOrders;
//# sourceMappingURL=get-open-orders.js.map