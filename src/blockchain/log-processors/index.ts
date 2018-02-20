import { LogProcessors } from "../../types";
import { processMarketCreatedLog, processMarketCreatedLogRemoval } from "./market-created";
import { processTokensTransferredLog, processTokensTransferredLogRemoval } from "./tokens-transferred";
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from "./order-canceled";
import { processOrderCreatedLog, processOrderCreatedLogRemoval } from "./order-created";
import { processOrderFilledLog, processOrderFilledLogRemoval } from "./order-filled";
import { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } from "./trading-proceeds-claimed";
import { processWinningsRedeemedLog, processWinningsRedeemedLogRemoval } from "./winnings-redeemed";
import { processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval } from "./crowdsourcer";
import { processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval } from "./crowdsourcer";
import { processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval } from "./crowdsourcer";
import { processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval } from "./initial-report-submitted";
import { processMarketFinalizedLog, processMarketFinalizedLogRemoval } from "./market-finalized";
import { processUniverseCreatedLog, processUniverseCreatedLogRemoval } from "./universe-created";
import { processFeeWindowCreatedLog, processFeeWindowCreatedLogRemoval } from "./fee-window-created";
import { processApprovalLog, processApprovalLogRemoval } from "./token/approval";
import { processMintLog, processMintLogRemoval } from "./token/mint";
import { processBurnLog, processBurnLogRemoval } from "./token/burn";
import { processFundedAccountLog } from "./token/funded-account";
import { processTimestampSetLog, processTimestampSetLogRemoval } from "./timestamp-set";
import { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } from "./completesets";
import { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } from "./initial-report-redeemed";
import { processInitialReporterTransferredLog, processInitialReporterTransferredLogRemoval } from "./initial-report-transferred";

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
    InitialReporterRedeemed: {
      add: processInitialReporterRedeemedLog,
      remove: processInitialReporterRedeemedLogRemoval,
    },
    InitialReporterTransfered: {
      add: processInitialReporterTransferredLog,
      remove: processInitialReporterTransferredLogRemoval,
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
    DisputeCrowdsourcerCreated: {
      add: processDisputeCrowdsourcerCreatedLog,
      remove: processDisputeCrowdsourcerCreatedLogRemoval,
    },
    DisputeCrowdsourcerContribution: {
      add: processDisputeCrowdsourcerContributionLog,
      remove: processDisputeCrowdsourcerContributionLogRemoval,
    },
    DisputeCrowdsourcerCompleted: {
      add: processDisputeCrowdsourcerCompletedLog,
      remove: processDisputeCrowdsourcerCompletedLogRemoval,
    },
    TokensBurned: {
      add: processBurnLog,
      remove: processBurnLogRemoval,
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
    UniverseCreated: {
      add: processUniverseCreatedLog,
      remove: processUniverseCreatedLogRemoval,
    },
    WinningsRedeemed: {
      add: processWinningsRedeemedLog,
      remove: processWinningsRedeemedLogRemoval,
    },
    TimestampSet: {
      add: processTimestampSetLog,
      remove: processTimestampSetLogRemoval,
    },
    CompleteSetsPurchased: {
      add: processCompleteSetsPurchasedOrSoldLog,
      remove: processCompleteSetsPurchasedOrSoldLogRemoval,
    },
    CompleteSetsSold: {
      add: processCompleteSetsPurchasedOrSoldLog,
      remove: processCompleteSetsPurchasedOrSoldLogRemoval,
    },
  },
  LegacyReputationToken: {
    Transfer: {
      add: processTokensTransferredLog,
      remove: processTokensTransferredLogRemoval,
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
      add: processTokensTransferredLog,
      remove: processTokensTransferredLogRemoval,
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
