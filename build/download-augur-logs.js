"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const process_logs_1 = require("./process-logs");
const log_processors_1 = require("./log-processors");
const UPLOAD_BLOCK_NUMBER = {
    "1": 4086425,
    "3": 1377804,
    "4": 590387 // Rinkeby (network 4)
};
function downloadAugurLogs(db, augur, callback) {
    const fromBlock = UPLOAD_BLOCK_NUMBER[augur.rpc.getNetworkID()];
    augur.logs.getAllAugurLogs({ fromBlock }, (err, allAugurLogs) => {
        if (err)
            return callback(new Error(JSON.stringify(err)));
        async_1.each(Object.keys(allAugurLogs), (contractName, nextContractName) => (async_1.each(Object.keys(allAugurLogs[contractName]), (eventName, nextEventName) => (process_logs_1.processLogs(db, allAugurLogs[contractName][eventName], log_processors_1.logProcessors[contractName][eventName], callback)), nextContractName)), callback);
    });
}
exports.downloadAugurLogs = downloadAugurLogs;
//# sourceMappingURL=download-augur-logs.js.map