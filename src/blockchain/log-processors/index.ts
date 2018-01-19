import { LogProcessors } from "../../types";
import { processMarketCreatedLog, processMarketCreatedLogRemoval } from "./market-created";
import { processTokensTransferredLog, processTokensTransferredLogRemoval } from "./tokens-transferred";
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from "./order-canceled";
import { processOrderCreatedLog, processOrderCreatedLogRemoval } from "./order-created";
import { processOrderFilledLog, processOrderFilledLogRemoval } from "./order-filled";
import { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } from "./trading-proceeds-claimed";
import { processReportSubmittedLog, processReportSubmittedLogRemoval } from "./report-submitted";
import { processWinningTokensRedeemedLog, processWinningTokensRedeemedLogRemoval } from "./winning-tokens-redeemed";
import { processReportsDisputedLog, processReportsDisputedLogRemoval } from "./reports-disputed";
import { processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval } from "./initial-report-submitted";
import { processMarketFinalizedLog, processMarketFinalizedLogRemoval } from "./market-finalized";
import { processUniverseForkedLog, processUniverseForkedLogRemoval } from "./universe-forked";
import { processFeeWindowCreatedLog, processFeeWindowCreatedLogRemoval } from "./fee-window-created";
import { processTransferLog, processTransferLogRemoval } from "./token/transfer";
import { processApprovalLog, processApprovalLogRemoval } from "./token/approval";
import { processMintLog, processMintLogRemoval } from "./token/mint";
import { processBurnLog, processBurnLogRemoval } from "./token/burn";
import { processFundedAccountLog } from "./token/funded-account";

export const logProcessors: LogProcessors = {
  Augur: {
    FeeWindowCreated: {
      add: processFeeWindowCreatedLog,
      remove: processFeeWindowCreatedLogRemoval,
    },
    InitialReportSubmitted: {
      add: processInitialReportSubmittedLog,
      remove: processInitialReportSubmittedLogRemoval,
    },
    MarketCreated: {
      add: processMarketCreatedLog,
      remove: processMarketCreatedLogRemoval,
    },
    MarketFinalized: {
      add: processMarketFinalizedLog,
      remove: processMarketFinalizedLogRemoval,
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
    ReportsDisputed: {
      add: processReportsDisputedLog,
      remove: processReportsDisputedLogRemoval,
    },
    ReportSubmitted: {
      add: processReportSubmittedLog,
      remove: processReportSubmittedLogRemoval,
    },
    TokensMinted: {
      add: processMintLog,
      remove: processMintLogRemoval,
    },
    TokensTransferred: {
      add: processTokensTransferredLog,
      remove: processTokensTransferredLogRemoval,
    },
    TradingProceedsClaimed: {
      add: processTradingProceedsClaimedLog,
      remove: processTradingProceedsClaimedLogRemoval,
    },
    UniverseForked: {
      add: processUniverseForkedLog,
      remove: processUniverseForkedLogRemoval,
    },
    WinningTokensRedeemed: {
      add: processWinningTokensRedeemedLog,
      remove: processWinningTokensRedeemedLogRemoval,
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
