"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
function processLogs(db, logs, processLog, callback) {
    async_1.each(logs, (log, nextLog) => processLog(db, log, nextLog), callback);
}
exports.processLogs = processLogs;
//# sourceMappingURL=process-logs.js.map