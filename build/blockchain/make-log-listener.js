"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_processors_1 = require("./log-processors");
const log_error_1 = require("../utils/log-error");
function makeLogListener(db, contractName, eventName) {
    return (log) => {
        console.log(contractName, eventName, log);
        log_processors_1.logProcessors[contractName][eventName](db, log, log_error_1.logError);
    };
}
exports.makeLogListener = makeLogListener;
//# sourceMappingURL=make-log-listener.js.map