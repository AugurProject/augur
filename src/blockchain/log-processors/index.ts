import { LogProcessors } from "../../types";
import { processMarketCreatedLog, processMarketCreatedLogRemoval } from "./market-created";
import { processTokensTransferredLog, processTokensTransferredLogRemoval } from "./tokens-transferred";
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from "./order-canceled";
import { processOrderCreatedLog, processOrderCreatedLogRemoval } from "./order-created";
import { processOrderFilledLog, processOrderFilledLogRemoval } from "./order-filled";
import { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } from "./trading-proceeds-claimed";
import { processDesignatedReportSubmittedLog, processDesignatedReportSubmittedLogRemoval } from "./designated-report-submitted";
import { processReportSubmittedLog, processReportSubmittedLogRemoval } from "./report-submitted";
import { processWinningTokensRedeemedLog, processWinningTokensRedeemedLogRemoval } from "./winning-tokens-redeemed";
import { processReportsDisputedLog, processReportsDisputedLogRemoval } from "./reports-disputed";
import { processMarketFinalizedLog, processMarketFinalizedLogRemoval } from "./market-finalized";
import { processUniverseForkedLog, processUniverseForkedLogRemoval } from "./universe-forked";
import { processReportingWindowCreatedLog, processReportingWindowCreatedLogRemoval } from "./reporting-window-created";
import { processTransferLog, processTransferLogRemoval } from "./token/transfer";
import { processApprovalLog, processApprovalLogRemoval } from "./token/approval";
import { processMintLog, processMintLogRemoval } from "./token/mint";
import { processBurnLog, processBurnLogRemoval } from "./token/burn";
import { processFundedAccountLog } from "./token/funded-account";

export const logProcessors: LogProcessors = {
  Augur: {
    MarketCreated: {
      add: processMarketCreatedLog,
      remove: processMarketCreatedLogRemoval,
    },
    TokensTransferred: {
      add: processTokensTransferredLog,
      remove: processTokensTransferredLogRemoval,
    },
    TokensMinted: {
      add: processMintLog,
      remove: processMintLogRemoval,
    },
    OrderCanceled: {
      add: processOrderCanceledLog,
      remove: processOrderCanceledLogRemoval,
    },
    OrderCreated: {
      noAutoEmit: true,
      add: processOrderCreatedLog,
      remove: processOrderCreatedLogRemoval,
    },
    OrderFilled: {
      noAutoEmit: true,
      add: processOrderFilledLog,
      remove: processOrderFilledLogRemoval,
    },
    TradingProceedsClaimed: {
      add: processTradingProceedsClaimedLog,
      remove: processTradingProceedsClaimedLogRemoval,
    },
    DesignatedReportSubmitted: {
      add: processDesignatedReportSubmittedLog,
      remove: processDesignatedReportSubmittedLogRemoval,
    },
    ReportSubmitted: {
      add: processReportSubmittedLog,
      remove: processReportSubmittedLogRemoval,
    },
    WinningTokensRedeemed: {
      add: processWinningTokensRedeemedLog,
      remove: processWinningTokensRedeemedLogRemoval,
    },
    ReportsDisputed: {
      add: processReportsDisputedLog,
      remove: processReportsDisputedLogRemoval,
    },
    MarketFinalized: {
      add: processMarketFinalizedLog,
      remove: processMarketFinalizedLogRemoval,
    },
    ReportingWindowCreated: {
      add: processReportingWindowCreatedLog,
      remove: processReportingWindowCreatedLogRemoval,
    },
    UniverseForked: {
      add: processUniverseForkedLog,
      remove: processUniverseForkedLogRemoval,
    },
  },
  LegacyReputationToken: {
    Transfer: {
      add: processTransferLog,
      remove: processTransferLogRemoval,
    },
    Approval: {
      add: processApprovalLog,
      remove: processApprovalLogRemoval,
    },
    Mint: {
      add: processMintLog,
      remove: processMintLogRemoval,
    },
    FundedAccount: {
      add: processFundedAccountLog,
      remove: processFundedAccountLog,
    },
  },
  Cash: {
    Transfer: {
      add: processTransferLog,
      remove: processTransferLogRemoval,
    },
    Approval: {
      add: processApprovalLog,
      remove: processApprovalLogRemoval,
    },
    Mint: {
      add: processMintLog,
      remove: processMintLogRemoval,
    },
    Burn: {
      add: processBurnLog,
      remove: processBurnLogRemoval,
    },
  },
};
