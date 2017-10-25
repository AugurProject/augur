import { LogProcessor } from "../../types";
import { processMarketCreatedLog, processMarketCreatedLogRemoval } from "./market-created";
import { processTokensTransferredLog, processTokensTransferredLogRemoval } from "./tokens-transferred";
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from "./order-canceled";
import { processOrderCreatedLog, processOrderCreatedLogRemoval } from "./order-created";
import { processOrderFilledLog, processOrderFilledLogRemoval } from "./order-filled";
import { processProceedsClaimedLog, processProceedsClaimedLogRemoval } from "./proceeds-claimed";
import { processDesignatedReportSubmittedLog, processDesignatedReportSubmittedLogRemoval } from "./designated-report-submitted";
import { processReportSubmittedLog, processReportSubmittedLogRemoval } from "./report-submitted";
import { processWinningTokensRedeemedLog, processWinningTokensRedeemedLogRemoval } from "./winning-tokens-redeemed";
import { processReportsDisputedLog, processReportsDisputedLogRemoval } from "./reports-disputed";
import { processMarketFinalizedLog, processMarketFinalizedLogRemoval } from "./market-finalized";
import { processUniverseForkedLog, processUniverseForkedLogRemoval } from "./universe-forked";
import { processTransferLog, processTransferLogRemoval } from "./legacy-rep-contract/transfer";
import { processApprovalLog, processApprovalLogRemoval } from "./legacy-rep-contract/approval";

export const logProcessors: {[contractName: string]: {[eventName: string]: LogProcessor}} = {
  Augur: {
    MarketCreated: processMarketCreatedLog,
    TokensTransferred: processTokensTransferredLog,
    OrderCanceled: processOrderCanceledLog,
    OrderCreated: processOrderCreatedLog,
    OrderFilled: processOrderFilledLog,
    ProceedsClaimed: processProceedsClaimedLog,
    DesignatedReportSubmitted: processDesignatedReportSubmittedLog,
    ReportSubmitted: processReportSubmittedLog,
    WinningTokensRedeemed: processWinningTokensRedeemedLog,
    ReportsDisputed: processReportsDisputedLog,
    MarketFinalized: processMarketFinalizedLog,
    UniverseForked: processUniverseForkedLog,
  },
  LegacyRepContract: {
    Transfer: processTransferLog,
    Approval: processApprovalLog,
  },
};

export const logRemovalProcessors: {[contractName: string]: {[eventName: string]: LogProcessor}} = {
  Augur: {
    MarketCreated: processMarketCreatedLogRemoval,
    TokensTransferred: processTokensTransferredLogRemoval,
    OrderCanceled: processOrderCanceledLogRemoval,
    OrderCreated: processOrderCreatedLogRemoval,
    OrderFilled: processOrderFilledLogRemoval,
    ProceedsClaimed: processProceedsClaimedLogRemoval,
    DesignatedReportSubmitted: processDesignatedReportSubmittedLogRemoval,
    ReportSubmitted: processReportSubmittedLogRemoval,
    WinningTokensRedeemed: processWinningTokensRedeemedLogRemoval,
    ReportsDisputed: processReportsDisputedLogRemoval,
    MarketFinalized: processMarketFinalizedLogRemoval,
    UniverseForked: processUniverseForkedLogRemoval,
  },
  LegacyRepContract: {
    Transfer: processTransferLogRemoval,
    Approval: processApprovalLogRemoval,
  },
};
