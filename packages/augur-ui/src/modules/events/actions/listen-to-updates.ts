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
import { Augur, SubscriptionEventNames, Provider } from '@augurproject/sdk';

const EVENTS = {
  [SubscriptionEventNames.NewBlock]: wrapLogHandler(handleNewBlockLog),
  [SubscriptionEventNames.MarketCreated]: wrapLogHandler(
    handleMarketCreatedLog
  ),
  [SubscriptionEventNames.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventNames.TokensTransferred]: wrapLogHandler(
    handleTokensTransferredLog
  ),
  // [SubscriptionEventNames.OrderCreated]: wrapLogHandler(handleOrderCreatedLog),
  // [SubscriptionEventNames.OrderCanceled]: wrapLogHandler(handleOrderCanceledLog),
  // [SubscriptionEventNames.OrderFilled]: wrapLogHandler(handleOrderFilledLog),
  [SubscriptionEventNames.TradingProceedsClaimed]: wrapLogHandler(
    handleTradingProceedsClaimedLog
  ),
  [SubscriptionEventNames.InitialReportSubmitted]: wrapLogHandler(
    handleInitialReportSubmittedLog
  ),
  [SubscriptionEventNames.InitialReporterRedeemed]: wrapLogHandler(
    handleInitialReporterRedeemedLog
  ),
  [SubscriptionEventNames.MarketFinalized]: wrapLogHandler(
    handleMarketFinalizedLog
  ),
  [SubscriptionEventNames.DisputeCrowdsourcerCreated]: wrapLogHandler(
    handleDisputeCrowdsourcerCreatedLog
  ),
  [SubscriptionEventNames.DisputeCrowdsourcerContribution]: wrapLogHandler(
    handleDisputeCrowdsourcerContributionLog
  ),
  [SubscriptionEventNames.DisputeCrowdsourcerCompleted]: wrapLogHandler(
    handleDisputeCrowdsourcerCompletedLog
  ),
  // [SubscriptionEventNames.DisputeCrowdsourcerRedeemed]:
  //   wrapLogHandler(handleDisputeCrowdsourcerRedeemedLog)
  // ),
  // [SubscriptionEventNames.UniverseForked]: wrapLogHandler()),
  [SubscriptionEventNames.CompleteSetsPurchased]: wrapLogHandler(),
  [SubscriptionEventNames.CompleteSetsSold]: wrapLogHandler(
    handleCompleteSetsSoldLog
  ),
  // [SubscriptionEventNames.TokensMinted]: wrapLogHandler(handleTokensMintedLog)),
  [SubscriptionEventNames.TokensBurned]: wrapLogHandler(handleTokensBurnedLog),
  // [SubscriptionEventNames.FeeWindowCreated]: wrapLogHandler(handleFeeWindowCreatedLog)),
  // [SubscriptionEventNames.FeeWindowOpened]: wrapLogHandler(handleFeeWindowOpenedLog)),
  [SubscriptionEventNames.InitialReporterTransferred]: wrapLogHandler(),
  // [SubscriptionEventNames.TimestampSet]: wrapLogHandler()),
  // [SubscriptionEventNames.FeeWindowRedeemed]: wrapLogHandler(handleFeeWindowRedeemedLog)),
  [SubscriptionEventNames.UniverseCreated]: wrapLogHandler(),
  // [SubscriptionEventNames.Approval]: wrapLogHandler(handleApprovalLog))
};

export const listenToUpdates = (Augur: Augur<Provider>) => (
  dispatch: ThunkDispatch<void, any, Action>
) =>
  Object.keys(EVENTS).map(e => {
    Augur.on(e, (log) => dispatch(EVENTS[e](log)));
  });
