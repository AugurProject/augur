"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAccountTransferHistory(db, account, token, callback) {
    let query;
    let dataToSelect;
    if (token == null) {
        query = `SELECT * FROM transfers WHERE sender = ? OR recipient = ?`;
        dataToSelect = [account, account];
    }
    else {
        query = `SELECT * FROM transfers WHERE (sender = ? OR recipient = ?) AND token = ?`;
        dataToSelect = [account, account, token];
    }
    db.all(query, dataToSelect, (err, transferRows) => {
        if (err)
            return callback(err);
        if (!transferRows)
            return callback(null);
        const transferHistory = transferRows.map((transferRow) => ({
            transactionHash: transferRow.transaction_hash,
            logIndex: transferRow.log_index,
            sender: transferRow.sender,
            recipient: transferRow.recipient,
            token: transferRow.token,
            value: transferRow.value,
            blockNumber: transferRow.block_number
        }));
        callback(null, transferHistory);
    });
}
exports.getAccountTransferHistory = getAccountTransferHistory;
//# sourceMappingURL=get-account-transfer-history.js.map