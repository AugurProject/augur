import {
  handleMarketCreatedLog,
  handleMarketMigratedLog,
  handleTokensTransferredLog,
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
  handleFeeWindowCreatedLog,
  handleFeeWindowOpenedLog,
  handleTokensMintedLog,
  handleTokensBurnedLog,
  handleFeeWindowRedeemedLog,
  handleCompleteSetsSoldLog,
  handleApprovalLog,
  handleNewBlockLog,
} from 'modules/events/actions/log-handlers';
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Augur, SubscriptionEventName, Provider } from '@augurproject/sdk';

const EVENTS = {
  [SubscriptionEventName.NewBlock]: wrapLogHandler(handleNewBlockLog),
  [SubscriptionEventName.MarketCreated]: wrapLogHandler(
    handleMarketCreatedLog
  ),
  [SubscriptionEventName.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventName.TokensTransferred]: wrapLogHandler(
    handleTokensTransferredLog
  ),
  // [SubscriptionEventName.OrderCreated]: wrapLogHandler(handleOrderCreatedLog),
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
  // [SubscriptionEventName.DisputeCrowdsourcerRedeemed]:
  //   wrapLogHandler(handleDisputeCrowdsourcerRedeemedLog)
  // ),
  // [SubscriptionEventName.UniverseForked]: wrapLogHandler()),
  [SubscriptionEventName.CompleteSetsPurchased]: wrapLogHandler(),
  [SubscriptionEventName.CompleteSetsSold]: wrapLogHandler(
    handleCompleteSetsSoldLog
  ),
  // [SubscriptionEventName.TokensMinted]: wrapLogHandler(handleTokensMintedLog)),
  [SubscriptionEventName.TokensBurned]: wrapLogHandler(handleTokensBurnedLog),
  // [SubscriptionEventName.FeeWindowCreated]: wrapLogHandler(handleFeeWindowCreatedLog)),
  // [SubscriptionEventName.FeeWindowOpened]: wrapLogHandler(handleFeeWindowOpenedLog)),
  [SubscriptionEventName.InitialReporterTransferred]: wrapLogHandler(),
  // [SubscriptionEventName.TimestampSet]: wrapLogHandler()),
  // [SubscriptionEventName.FeeWindowRedeemed]: wrapLogHandler(handleFeeWindowRedeemedLog)),
  [SubscriptionEventName.UniverseCreated]: wrapLogHandler(),
  // [SubscriptionEventName.Approval]: wrapLogHandler(handleApprovalLog))
};

export const listenToUpdates = (Augur: Augur<Provider>) => (
  dispatch: ThunkDispatch<void, any, Action>
) =>
  Object.keys(EVENTS).map(e => {
    Augur.on(e, (log) => dispatch(EVENTS[e](log)));
  });
