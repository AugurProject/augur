"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processApprovalLog(db, log, callback) {
    const dataToInsert = [
        log.transactionHash, log.logIndex, log.owner, log.spender, log.address, log.value, log.blockNumber
    ];
    db.run(`INSERT INTO approvals
    (transaction_hash, log_index, owner, spender, token, value, block_number)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
}
exports.processApprovalLog = processApprovalLog;
//# sourceMappingURL=approval.js.map