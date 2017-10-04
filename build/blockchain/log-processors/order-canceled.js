"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processOrderCanceledLog(db, log, callback) {
    db.run(`DELETE FROM orders WHERE order_id = ?`, [log.orderId], callback);
}
exports.processOrderCanceledLog = processOrderCanceledLog;
//# sourceMappingURL=order-canceled.js.map