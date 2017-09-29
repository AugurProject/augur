"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTransferHistory(db, account, marketId, callback) {
    db.get(`SELECT * FROM transfers WHERE contract_address = ?`, [marketId], (err, row) => {
        if (err)
            return callback(err);
        callback(null, row);
    });
}
exports.getTransferHistory = getTransferHistory;
//# sourceMappingURL=get-transfer-history.js.map