"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processTransferLog(db, log, callback) {
    const dataToInsert = [
        log.transactionHash, log.logIndex, log.from, log.to, log.address, log.value, log.blockNumber
    ];
    db.run(`INSERT INTO transfers
    (transaction_hash, log_index, sender, recipient, token, value, block_number)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
}
exports.processTransferLog = processTransferLog;
//# sourceMappingURL=transfer.js.map