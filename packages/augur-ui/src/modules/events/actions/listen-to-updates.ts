import {
  handleMarketCreatedLog,
  handleMarketMigratedLog,
  handleTokensTransferredLog,
  handleOrderLog,
  handleOrderCreatedLog,
  handleOrderCanceledLog,
  handleOrderFilledLog,
  handleTradingProceedsClaimedLog,
  handleInitialReportSubmittedLog,
  handleInitialReporterRedeemedLog,
  handleMarketFinalizedLog,
  handleDisputeCrowdsourcerCreatedLog,
  handleDisputeCrowdsourcerContributionLog,
  handleDisputeCrowdsourcerCompletedLog,
  handleDisputeCrowdsourcerRedeemedLog,
  handleDisputeWindowCreatedLog,
  handleTokensMintedLog,
  handleTokensBurnedLog,
  handleFeeWindowRedeemedLog,
  handleNewBlockLog,
  handleTxAwaitingSigning,
  handleTxSuccess,
  handleTxPending,
  handleTxFailure,
} from 'modules/events/actions/log-handlers';
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  Augur,
  SubscriptionEventName,
  Provider,
  TXEventName,
} from '@augurproject/sdk';

const StartUpEvents = {
  [SubscriptionEventName.NewBlock]: wrapLogHandler(handleNewBlockLog),
};

const EVENTS = {
  [SubscriptionEventName.MarketCreated]: wrapLogHandler(handleMarketCreatedLog),
  [SubscriptionEventName.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventName.TokensTransferred]: wrapLogHandler(
    handleTokensTransferredLog
  ),
  [SubscriptionEventName.OrderEvent]: wrapLogHandler(handleOrderLog),
  // [SubscriptionEventName.OrderCanceled]: wrapLogHandler(handleOrderCanceledLog),
  // [SubscriptionEventName.OrderFilled]: wrapLogHandler(handleOrderFilledLog),
  [SubscriptionEventName.TradingProceedsClaimed]: wrapLogHandler(
    handleTradingProceedsClaimedLog
  ),
  [SubscriptionEventName.InitialReportSubmitted]: wrapLogHandler(
    handleInitialReportSubmittedLog
  ),
  [SubscriptionEventName.InitialReporterRedeemed]: wrapLogHandler(
    handleInitialReporterRedeemedLog
  ),
  [SubscriptionEventName.MarketFinalized]: wrapLogHandler(
    handleMarketFinalizedLog
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
  [SubscriptionEventName.DisputeCrowdsourcerRedeemed]:
     wrapLogHandler(handleDisputeCrowdsourcerRedeemedLog)
  ,
  // [SubscriptionEventName.UniverseForked]: wrapLogHandler()),
  // [SubscriptionEventName.TokensMinted]: wrapLogHandler(handleTokensMintedLog)),
  [SubscriptionEventName.TokensBurned]: wrapLogHandler(handleTokensBurnedLog),
  [SubscriptionEventName.DisputeWindowCreated]: wrapLogHandler(handleDisputeWindowCreatedLog),
  [SubscriptionEventName.InitialReporterTransferred]: wrapLogHandler(),
  // [SubscriptionEventName.TimestampSet]: wrapLogHandler()),
  // [SubscriptionEventName.FeeWindowRedeemed]: wrapLogHandler(handleFeeWindowRedeemedLog)),
  [SubscriptionEventName.UniverseCreated]: wrapLogHandler(),
  [TXEventName.AwaitingSigning]: wrapLogHandler(handleTxAwaitingSigning),
  [TXEventName.Success]: wrapLogHandler(handleTxSuccess),
  [TXEventName.Pending]: wrapLogHandler(handleTxPending),
  [TXEventName.Failure]: wrapLogHandler(handleTxFailure),
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
