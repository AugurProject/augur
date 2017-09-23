"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_processors_1 = require("./log-processors");
const log_error_1 = require("./log-error");
function startAugurListeners(db, augur, callback) {
    augur.filters.startListeners({
        Augur: {
            MarketCreated: (log) => {
                console.log("MarketCreated", log);
                log_processors_1.logProcessors.Augur.MarketCreated(db, log, log_error_1.logError);
            },
            TokensTransferred: (log) => {
                console.log("TokensTransferred", log);
                log_processors_1.logProcessors.Augur.TokensTransferred(db, log, log_error_1.logError);
            }
        }
    }, (blockHash) => console.log("block", blockHash), callback);
}
exports.startAugurListeners = startAugurListeners;
//# sourceMappingURL=start-augur-listeners.js.map