"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const market_created_1 = require("./market-created");
const tokens_transferred_1 = require("./tokens-transferred");
const order_canceled_1 = require("./order-canceled");
const order_created_1 = require("./order-created");
const order_filled_1 = require("./order-filled");
const proceeds_claimed_1 = require("./proceeds-claimed");
const reporter_registered_1 = require("./reporter-registered");
const designated_report_submitted_1 = require("./designated-report-submitted");
const report_submitted_1 = require("./report-submitted");
const winning_tokens_redeemed_1 = require("./winning-tokens-redeemed");
const reports_disputed_1 = require("./reports-disputed");
const market_finalized_1 = require("./market-finalized");
const universe_forked_1 = require("./universe-forked");
const transfer_1 = require("./legacy-rep-contract/transfer");
const approval_1 = require("./legacy-rep-contract/approval");
exports.logProcessors = {
    Augur: {
        MarketCreated: market_created_1.processMarketCreatedLog,
        TokensTransferred: tokens_transferred_1.processTokensTransferredLog,
        OrderCanceled: order_canceled_1.processOrderCanceledLog,
        OrderCreated: order_created_1.processOrderCreatedLog,
        OrderFilled: order_filled_1.processOrderFilledLog,
        ProceedsClaimed: proceeds_claimed_1.processProceedsClaimedLog,
        ReporterRegistered: reporter_registered_1.processReporterRegisteredLog,
        DesignatedReportSubmitted: designated_report_submitted_1.processDesignatedReportSubmittedLog,
        ReportSubmitted: report_submitted_1.processReportSubmittedLog,
        WinningTokensRedeemed: winning_tokens_redeemed_1.processWinningTokensRedeemedLog,
        ReportsDisputed: reports_disputed_1.processReportsDisputedLog,
        MarketFinalized: market_finalized_1.processMarketFinalizedLog,
        UniverseForked: universe_forked_1.processUniverseForkedLog
    },
    LegacyRepContract: {
        Transfer: transfer_1.processTransferLog,
        Approval: approval_1.processApprovalLog
    }
};
//# sourceMappingURL=index.js.map