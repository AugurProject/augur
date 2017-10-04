"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processTokensTransferredLog(db, log, callback) {
    const dataToInsert = [
        log.transactionHash, log.logIndex, log.from, log.to, log.token, log.value, log.blockNumber
    ];
    db.run(`INSERT INTO transfers
    (transaction_hash, log_index, sender, recipient, token, value, block_number)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
}
exports.processTokensTransferredLog = processTokensTransferredLog;
//# sourceMappingURL=tokens-transferred.js.map