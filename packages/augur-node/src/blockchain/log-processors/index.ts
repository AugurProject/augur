import Knex from "knex";
import { Augur, EventLogProcessor, FormattedEventLog, LogProcessors } from "../../types";
import { processMarketCreatedLog, processMarketCreatedLogRemoval } from "./market-created";
import { processTokensTransferredLog, processTokensTransferredLogRemoval } from "./tokens-transferred";
import { processOrderEventLog, processOrderEventLogRemoval } from "./order-event";
import { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } from "./trading-proceeds-claimed";
import {
  processDisputeCrowdsourcerCompletedLog,
  processDisputeCrowdsourcerCompletedLogRemoval,
  processDisputeCrowdsourcerContributionLog,
  processDisputeCrowdsourcerContributionLogRemoval,
  processDisputeCrowdsourcerCreatedLog,
  processDisputeCrowdsourcerCreatedLogRemoval,
  processDisputeCrowdsourcerRedeemedLog,
  processDisputeCrowdsourcerRedeemedLogRemoval
} from "./crowdsourcer";
import { processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval } from "./initial-report-submitted";
import { processMarketFinalizedLog, processMarketFinalizedLogRemoval } from "./market-finalized";
import { processUniverseCreatedLog, processUniverseCreatedLogRemoval } from "./universe-created";
import { processUniverseForkedLog, processUniverseForkedLogRemoval } from "./universe-forked";
import { processDisputeWindowCreatedLog, processDisputeWindowCreatedLogRemoval } from "./dispute-window-created";
import { processApprovalLog, processApprovalLogRemoval } from "./token/approval";
import { processMintLog, processMintLogRemoval } from "./token/mint";
import { processBurnLog, processBurnLogRemoval } from "./token/burn";
import { processTimestampSetLog, processTimestampSetLogRemoval } from "./timestamp-set";
import { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } from "./completesets";
import { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } from "./initial-report-redeemed";
import {
  processInitialReporterTransferredLog,
  processInitialReporterTransferredLogRemoval
} from "./initial-report-transferred";
import { processMarketMigratedLog, processMarketMigratedLogRemoval } from "./market-migrated";
import {
  processReportingParticipantDisavowedLog,
  processReportingParticipantDisavowedLogRemoval
} from "./reporting-participant-disavowed";
import {
  processMarketParticipantsDisavowedLog,
  processMarketParticipantsDisavowedLogRemoval
} from "./market-participants-disavowed";

async function noop(augur: Augur, log: FormattedEventLog) {
  return async(db: Knex) => {
  };
}

const passThroughLog: EventLogProcessor = {
  add: noop,
  remove: noop,
  noAutoEmit: false,
};

export const logProcessors: LogProcessors = {
  Augur: {
    DisputeWindowCreated: {
      noAutoEmit: true,
      add: processDisputeWindowCreatedLog,
      remove: processDisputeWindowCreatedLogRemoval,
    },
    InitialReportSubmitted: {
      noAutoEmit: true,
      add: processInitialReportSubmittedLog,
      remove: processInitialReportSubmittedLogRemoval,
    },
    InitialReporterRedeemed: {
      noAutoEmit: true,
      add: processInitialReporterRedeemedLog,
      remove: processInitialReporterRedeemedLogRemoval,
    },
    InitialReporterTransferred: {
      noAutoEmit: true,
      add: processInitialReporterTransferredLog,
      remove: processInitialReporterTransferredLogRemoval,
    },
    MarketCreated: {
      noAutoEmit: true,
      add: processMarketCreatedLog,
      remove: processMarketCreatedLogRemoval,
    },
    MarketMigrated: {
      add: processMarketMigratedLog,
      remove: processMarketMigratedLogRemoval,
    },
    MarketFinalized: {
      add: processMarketFinalizedLog,
      remove: processMarketFinalizedLogRemoval,
    },
    /* not going to fix order processor
    OrderEvent: {
      noAutoEmit: true,
      add: processOrderEventLog,
      remove: processOrderEventLogRemoval,
    },
    */
    DisputeCrowdsourcerCreated: {
      noAutoEmit: true,
      add: processDisputeCrowdsourcerCreatedLog,
      remove: processDisputeCrowdsourcerCreatedLogRemoval,
    },
    DisputeCrowdsourcerContribution: {
      noAutoEmit: true,
      add: processDisputeCrowdsourcerContributionLog,
      remove: processDisputeCrowdsourcerContributionLogRemoval,
    },
    DisputeCrowdsourcerCompleted: {
      noAutoEmit: true,
      add: processDisputeCrowdsourcerCompletedLog,
      remove: processDisputeCrowdsourcerCompletedLogRemoval,
    },
    ReportingParticipantDisavowed: {
      noAutoEmit: true,
      add: processReportingParticipantDisavowedLog,
      remove: processReportingParticipantDisavowedLogRemoval,
    },
    TokensBurned: {
      noAutoEmit: true,
      add: processBurnLog,
      remove: processBurnLogRemoval,
    },
    TokensMinted: {
      add: processMintLog,
      remove: processMintLogRemoval,
    },
    TokensTransferred: {
      noAutoEmit: true,
      add: processTokensTransferredLog,
      remove: processTokensTransferredLogRemoval,
    },
    TradingProceedsClaimed: {
      noAutoEmit: true,
      add: processTradingProceedsClaimedLog,
      remove: processTradingProceedsClaimedLogRemoval,
    },
    UniverseCreated: {
      noAutoEmit: true,
      add: processUniverseCreatedLog,
      remove: processUniverseCreatedLogRemoval,
    },
    UniverseForked: {
      noAutoEmit: false,
      add: processUniverseForkedLog,
      remove: processUniverseForkedLogRemoval,
    },
    DisputeCrowdsourcerRedeemed: {
      noAutoEmit: true,
      add: processDisputeCrowdsourcerRedeemedLog,
      remove: processDisputeCrowdsourcerRedeemedLogRemoval,
    },
    TimestampSet: {
      add: processTimestampSetLog,
      remove: processTimestampSetLogRemoval,
    },
    CompleteSetsPurchased: {
      noAutoEmit: true,
      add: processCompleteSetsPurchasedOrSoldLog,
      remove: processCompleteSetsPurchasedOrSoldLogRemoval,
    },
    CompleteSetsSold: {
      noAutoEmit: true,
      add: processCompleteSetsPurchasedOrSoldLog,
      remove: processCompleteSetsPurchasedOrSoldLogRemoval,
    },
    MarketParticipantsDisavowed: {
      add: processMarketParticipantsDisavowedLog,
      remove: processMarketParticipantsDisavowedLogRemoval,
    },
  },
  LegacyReputationToken: {
    Transfer: passThroughLog,
    Approval: passThroughLog,
    Mint: passThroughLog,
    FundedAccount: passThroughLog,
  },
  Cash: {
    Transfer: {
      add: processTokensTransferredLog,
      remove: processTokensTransferredLogRemoval,
    },
    Approval: {
      noAutoEmit: true,
      add: processApprovalLog,
      remove: processApprovalLogRemoval,
    },
    Mint: {
      add: processMintLog,
      remove: processMintLogRemoval,
    },
    Burn: {
      noAutoEmit: true,
      add: processBurnLog,
      remove: processBurnLogRemoval,
    },
  },
};
