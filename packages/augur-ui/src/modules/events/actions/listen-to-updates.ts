import {
  handleMarketStateLog,
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
  handleApprovalLog
} from "modules/events/actions/log-handlers";
import { wrapLogHandler } from "modules/events/actions/wrap-log-handler";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { SubscriptionEventNames } from "@augurproject/sdk";
import { AppState } from "store";

// TODO: wire up new v2 events when they are ready in sdk
export const listenToUpdates = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => ({
  [SubscriptionEventNames.MarketState]: dispatch(wrapLogHandler(handleMarketStateLog)),
  [SubscriptionEventNames.MarketCreated]: dispatch(wrapLogHandler(handleMarketCreatedLog)),
  [SubscriptionEventNames.MarketMigrated]: dispatch(wrapLogHandler(handleMarketMigratedLog)),
  [SubscriptionEventNames.TokensTransferred]: dispatch(wrapLogHandler(handleTokensTransferredLog)),
  // [SubscriptionEventNames.OrderCreated]: dispatch(wrapLogHandler(handleOrderCreatedLog)),
  // [SubscriptionEventNames.OrderCanceled]: dispatch(wrapLogHandler(handleOrderCanceledLog)),
  // [SubscriptionEventNames.OrderFilled]: dispatch(wrapLogHandler(handleOrderFilledLog)),
  [SubscriptionEventNames.TradingProceedsClaimed]: dispatch(
    wrapLogHandler(handleTradingProceedsClaimedLog)
  ),
  [SubscriptionEventNames.InitialReportSubmitted]: dispatch(
    wrapLogHandler(handleInitialReportSubmittedLog)
  ),
  [SubscriptionEventNames.InitialReporterRedeemed]: dispatch(
    wrapLogHandler(handleInitialReporterRedeemedLog)
  ),
  [SubscriptionEventNames.MarketFinalized]: dispatch(wrapLogHandler(handleMarketFinalizedLog)),
  [SubscriptionEventNames.DisputeCrowdsourcerCreated]: dispatch(
    wrapLogHandler(handleDisputeCrowdsourcerCreatedLog)
  ),
  [SubscriptionEventNames.DisputeCrowdsourcerContribution]: dispatch(
    wrapLogHandler(handleDisputeCrowdsourcerContributionLog)
  ),
  [SubscriptionEventNames.DisputeCrowdsourcerCompleted]: dispatch(
    wrapLogHandler(handleDisputeCrowdsourcerCompletedLog)
  ),
  // [SubscriptionEventNames.DisputeCrowdsourcerRedeemed]: dispatch(
  //   wrapLogHandler(handleDisputeCrowdsourcerRedeemedLog)
  // ),
  // [SubscriptionEventNames.UniverseForked]: dispatch(wrapLogHandler()),
  [SubscriptionEventNames.CompleteSetsPurchased]: dispatch(wrapLogHandler()),
  [SubscriptionEventNames.CompleteSetsSold]: dispatch(wrapLogHandler(handleCompleteSetsSoldLog)),
  // [SubscriptionEventNames.TokensMinted]: dispatch(wrapLogHandler(handleTokensMintedLog)),
  [SubscriptionEventNames.TokensBurned]: dispatch(wrapLogHandler(handleTokensBurnedLog)),
  // [SubscriptionEventNames.FeeWindowCreated]: dispatch(wrapLogHandler(handleFeeWindowCreatedLog)),
  // [SubscriptionEventNames.FeeWindowOpened]: dispatch(wrapLogHandler(handleFeeWindowOpenedLog)),
  [SubscriptionEventNames.InitialReporterTransferred]: dispatch(wrapLogHandler()),
  // [SubscriptionEventNames.TimestampSet]: dispatch(wrapLogHandler()),
  // [SubscriptionEventNames.FeeWindowRedeemed]: dispatch(wrapLogHandler(handleFeeWindowRedeemedLog)),
  [SubscriptionEventNames.UniverseCreated]: dispatch(wrapLogHandler()),
  [SubscriptionEventNames.Approval]: dispatch(wrapLogHandler(handleApprovalLog))
});
