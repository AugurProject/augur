"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const process_logs_1 = require("./process-logs");
const log_processors_1 = require("./log-processors");
function downloadAugurLogs(db, augur, fromBlock, toBlock, callback) {
    augur.logs.getAllAugurLogs({ fromBlock, toBlock }, (err, allAugurLogs) => {
        if (err)
            return callback(err instanceof Error ? err : new Error(JSON.stringify(err)));
        async_1.each(Object.keys(allAugurLogs), (contractName, nextContractName) => (async_1.each(Object.keys(allAugurLogs[contractName]), (eventName, nextEventName) => (process_logs_1.processLogs(db, allAugurLogs[contractName][eventName], log_processors_1.logProcessors[contractName][eventName], callback)), nextContractName)), callback);
    });
}
exports.downloadAugurLogs = downloadAugurLogs;
//# sourceMappingURL=download-augur-logs.js.map