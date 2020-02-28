import {
  handleDisputeCrowdsourcerCompletedLog,
  handleDisputeCrowdsourcerContributionLog,
  handleDisputeCrowdsourcerCreatedLog,
  handleDisputeCrowdsourcerRedeemedLog,
  handleDisputeWindowCreatedLog,
  handleInitialReporterRedeemedLog,
  handleInitialReporterTransferredLog,
  handleInitialReportSubmittedLog,
  handleMarketCreatedLog,
  handleMarketFinalizedLog,
  handleMarketMigratedLog,
  handleMarketParticipantsDisavowedLog,
  handleMarketsUpdatedLog,
  handleMarketTransferredLog,
  handleNewBlockLog,
  handleOrderLog,
  handleParticipationTokensRedeemedLog,
  handleProfitLossChangedLog,
  handleReportingParticipantDisavowedLog,
  handleTokenBalanceChangedLog,
  handleTokensTransferredLog,
  handleTradingProceedsClaimedLog,
  handleTxAwaitingSigning,
  handleTxFailure,
  handleTxPending,
  handleTxSuccess,
  handleUniverseForkedLog,
  handleTxRelayerDown,
  handleTxFeeTooLow,
  handleSDKReadyEvent,
  handleTokensMintedLog,
  handleGnosisStateUpdate,
  handleDBMarketCreatedEvent,
  handleReportingStateChanged,
} from 'modules/events/actions/log-handlers';
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Augur, Provider, SubscriptionEventName, TXEventName, } from '@augurproject/sdk';

const StartUpEvents = {
  [SubscriptionEventName.SDKReady]: wrapLogHandler(handleSDKReadyEvent),
  [SubscriptionEventName.MarketsUpdated]: wrapLogHandler(
    handleMarketsUpdatedLog
  ),
};

const EVENTS = {
  [SubscriptionEventName.NewBlock]: wrapLogHandler(handleNewBlockLog),
  [SubscriptionEventName.MarketCreated]: wrapLogHandler(handleMarketCreatedLog),
  [SubscriptionEventName.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventName.OrderEvent]: wrapLogHandler(handleOrderLog),
  [SubscriptionEventName.TradingProceedsClaimed]: wrapLogHandler(
    handleTradingProceedsClaimedLog
  ),
  [SubscriptionEventName.InitialReportSubmitted]: wrapLogHandler(
    handleInitialReportSubmittedLog
  ),
  [SubscriptionEventName.InitialReporterRedeemed]: wrapLogHandler(
    handleInitialReporterRedeemedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerCreated]: wrapLogHandler(
    handleDisputeCrowdsourcerCreatedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerContribution]: wrapLogHandler(
    handleDisputeCrowdsourcerContributionLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerCompleted]: wrapLogHandler(
    handleDisputeCrowdsourcerCompletedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerRedeemed]: wrapLogHandler(
    handleDisputeCrowdsourcerRedeemedLog
  ),
  [SubscriptionEventName.UniverseForked]: wrapLogHandler(
    handleUniverseForkedLog
  ),
  [SubscriptionEventName.InitialReporterTransferred]: wrapLogHandler(
    handleInitialReporterTransferredLog
  ),
  [SubscriptionEventName.ParticipationTokensRedeemed]: wrapLogHandler(
    handleParticipationTokensRedeemedLog
  ),
  [SubscriptionEventName.ReportingParticipantDisavowed]: wrapLogHandler(
    handleReportingParticipantDisavowedLog
  ),
  [SubscriptionEventName.MarketParticipantsDisavowed]: wrapLogHandler(
    handleMarketParticipantsDisavowedLog
  ),
  [SubscriptionEventName.MarketTransferred]: wrapLogHandler(
    handleMarketTransferredLog
  ),
  [SubscriptionEventName.MarketsUpdated]: wrapLogHandler(
    handleMarketsUpdatedLog
  ),
  [SubscriptionEventName.GnosisSafeStatus]: wrapLogHandler(
    handleGnosisStateUpdate
  ),
  [SubscriptionEventName.DBMarketCreatedEvent]: wrapLogHandler(
    handleDBMarketCreatedEvent
  ),
  [SubscriptionEventName.ReportingStateChanged]: wrapLogHandler(
    handleReportingStateChanged
  ),
  [TXEventName.AwaitingSigning]: wrapLogHandler(handleTxAwaitingSigning),
  [TXEventName.Success]: wrapLogHandler(handleTxSuccess),
  [TXEventName.Pending]: wrapLogHandler(handleTxPending),
  [TXEventName.Failure]: wrapLogHandler(handleTxFailure),
  [TXEventName.RelayerDown]: wrapLogHandler(handleTxRelayerDown),
  [TXEventName.FeeTooLow]: wrapLogHandler(handleTxFeeTooLow),
};

export const listenToUpdates = (Augur: Augur<Provider>) => (
  dispatch: ThunkDispatch<void, any, Action>
) =>
  Object.keys(EVENTS).map(e => {
    Augur.on(e, log => dispatch(EVENTS[e](log)));
  });

export const listenForStartUpEvents = (Augur: Augur<Provider>) => (
  dispatch: ThunkDispatch<void, any, Action>
) =>
  Object.keys(StartUpEvents).map(e => {
    Augur.on(e, log => dispatch(StartUpEvents[e](log)));
  });

export const unListenToEvents = (Augur: Augur<Provider>) => {
  Object.keys(EVENTS).map(e => {
    Augur.off(e);
  });
  Object.keys(StartUpEvents).map(e => {
    Augur.off(e);
  });
};
