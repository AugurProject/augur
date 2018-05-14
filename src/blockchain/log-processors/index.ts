import * as Knex from "knex";
import Augur from "augur.js";
import { ErrorCallback, EventLogProcessor, FormattedEventLog, LogProcessors } from "../../types";
import { processMarketCreatedLog, processMarketCreatedLogRemoval } from "./market-created";
import { processTokensTransferredLog, processTokensTransferredLogRemoval } from "./tokens-transferred";
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from "./order-canceled";
import { processOrderCreatedLog, processOrderCreatedLogRemoval } from "./order-created";
import { processOrderFilledLog, processOrderFilledLogRemoval } from "./order-filled";
import { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } from "./trading-proceeds-claimed";
import { processDisputeCrowdsourcerRedeemedLog, processDisputeCrowdsourcerRedeemedLogRemoval } from "./crowdsourcer";
import { processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval } from "./crowdsourcer";
import { processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval } from "./crowdsourcer";
import { processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval } from "./crowdsourcer";
import { processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval } from "./initial-report-submitted";
import { processMarketFinalizedLog, processMarketFinalizedLogRemoval } from "./market-finalized";
import { processUniverseCreatedLog, processUniverseCreatedLogRemoval } from "./universe-created";
import { processUniverseForkedLog, processUniverseForkedLogRemoval } from "./universe-forked";
import { processFeeWindowCreatedLog, processFeeWindowCreatedLogRemoval } from "./fee-window-created";
import { processFeeWindowRedeemedLog, processFeeWindowRedeemedLogRemoval } from "./fee-window-redeemed";
import { processApprovalLog, processApprovalLogRemoval } from "./token/approval";
import { processMintLog, processMintLogRemoval } from "./token/mint";
import { processBurnLog, processBurnLogRemoval } from "./token/burn";
import { processTimestampSetLog, processTimestampSetLogRemoval } from "./timestamp-set";
import { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } from "./completesets";
import { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } from "./initial-report-redeemed";
import { processInitialReporterTransferredLog, processInitialReporterTransferredLogRemoval } from "./initial-report-transferred";
import { processMarketMigratedLog, processMarketMigratedLogRemoval } from "./market-migrated";
import { processReportingParticipantDisavowedLog, processReportingParticipantDisavowedLogRemoval } from "./reporting-participant-disavowed";
import { processMarketMailboxTransferredLog, processMarketMailboxTransferredLogRemoval } from "./market-mailbox-transferred";
import { processMarketParticipantsDisavowedLog, processMarketParticipantsDisavowedLogRemoval } from "./market-participants-disavowed";

function noop(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback) {
  callback(null);
}

const passThroughLog: EventLogProcessor = {
  add: noop,
  remove: noop,
  noAutoEmit: false,
};

export const logProcessors: LogProcessors = {
  Augur: {
    FeeWindowCreated: {
      noAutoEmit: true,
      add: processFeeWindowCreatedLog,
      remove: processFeeWindowCreatedLogRemoval,
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
    MarketMailboxTransferred: {
      noAutoEmit: false,
      add: processMarketMailboxTransferredLog,
      remove: processMarketMailboxTransferredLogRemoval,
    },
    MarketMigrated: {
      add: processMarketMigratedLog,
      remove: processMarketMigratedLogRemoval,
    },
    MarketFinalized: {
      add: processMarketFinalizedLog,
      remove: processMarketFinalizedLogRemoval,
    },
    OrderCanceled: {
      noAutoEmit: true,
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
    FeeWindowRedeemed: {
      noAutoEmit: true,
      add: processFeeWindowRedeemedLog,
      remove: processFeeWindowRedeemedLogRemoval,
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
