import { LogProcessors } from "../../types";
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
    OrderCanceled: {
      add: processOrderCanceledLog,
      remove: processOrderCanceledLogRemoval,
    },
    OrderCreated: {
      add: processOrderCreatedLog,
      remove: processOrderCreatedLogRemoval,
    },
    OrderFilled: {
      add: processOrderFilledLog,
      remove: processOrderFilledLogRemoval,
    },
    ProceedsClaimed: {
      add: processProceedsClaimedLog,
      remove: processProceedsClaimedLogRemoval,
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
    UniverseForked: {
      add: processUniverseForkedLog,
      remove: processUniverseForkedLogRemoval,
    },
  },
  LegacyRepContract: {
    Transfer: {
      add: processTransferLog,
      remove: processTransferLogRemoval,
    },
    Approval: {
      add: processApprovalLog,
      remove: processApprovalLogRemoval,
    },
  },
};
