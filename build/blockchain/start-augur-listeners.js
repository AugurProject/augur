"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const make_log_listener_1 = require("./make-log-listener");
const on_new_block_1 = require("./on-new-block");
function startAugurListeners(db, augur, callback) {
    augur.filters.startListeners({
        Augur: {
            MarketCreated: make_log_listener_1.makeLogListener(db, "Augur", "MarketCreated"),
            TokensTransferred: make_log_listener_1.makeLogListener(db, "Augur", "TokensTransferred"),
            OrderCanceled: make_log_listener_1.makeLogListener(db, "Augur", "OrderCanceled"),
            OrderCreated: make_log_listener_1.makeLogListener(db, "Augur", "OrderCreated"),
            OrderFilled: make_log_listener_1.makeLogListener(db, "Augur", "OrderFilled"),
            ProceedsClaimed: make_log_listener_1.makeLogListener(db, "Augur", "ProceedsClaimed"),
            ReporterRegistered: make_log_listener_1.makeLogListener(db, "Augur", "ReporterRegistered"),
            DesignatedReportSubmitted: make_log_listener_1.makeLogListener(db, "Augur", "DesignatedReportSubmitted"),
            ReportSubmitted: make_log_listener_1.makeLogListener(db, "Augur", "ReportSubmitted"),
            WinningTokensRedeemed: make_log_listener_1.makeLogListener(db, "Augur", "WinningTokensRedeemed"),
            ReportsDisputed: make_log_listener_1.makeLogListener(db, "Augur", "ReportsDisputed"),
            MarketFinalized: make_log_listener_1.makeLogListener(db, "Augur", "MarketFinalized"),
            UniverseForked: make_log_listener_1.makeLogListener(db, "Augur", "UniverseForked")
        },
        LegacyRepContract: {
            Transfer: make_log_listener_1.makeLogListener(db, "LegacyRepContract", "Transfer"),
            Approval: make_log_listener_1.makeLogListener(db, "LegacyRepContract", "Approval")
        }
    }, (blockNumber) => on_new_block_1.onNewBlock(db, augur, blockNumber), callback);
}
exports.startAugurListeners = startAugurListeners;
//# sourceMappingURL=start-augur-listeners.js.map