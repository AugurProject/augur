import {
  handleMarketMigratedLog,
  handleMarketsUpdatedLog,
  handleNewBlockLog,
  handleTradingProceedsClaimedLog,
  handleTxAwaitingSigning,
  handleTxFailure,
  handleTxPending,
  handleTxSuccess,
  handleUniverseForkedLog,
  handleTxRelayerDown,
  handleTxFeeTooLow,
  handleSDKReadyEvent,
  handleReportingStateChanged,
  handleWarpSyncHashUpdatedLog,
  handleZeroStatusUpdated,
  handleBulkOrdersLog,
  handleOrderLog,
} from 'modules/events/actions/log-handlers';
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Augur, Provider, SubscriptionEventName, TXEventName, } from '@augurproject/sdk';
import { ZEROX_STATUSES } from 'modules/common/constants';

const START_UP_EVENTS = {
  [SubscriptionEventName.SDKReady]: wrapLogHandler(handleSDKReadyEvent),
  [SubscriptionEventName.MarketsUpdated]: wrapLogHandler(
    handleMarketsUpdatedLog
  ),
  [SubscriptionEventName.ZeroXStatusReady]: wrapLogHandler(
    () => handleZeroStatusUpdated(ZEROX_STATUSES.READY)
  ),
  [SubscriptionEventName.ZeroXStatusStarted]: wrapLogHandler(
    () => handleZeroStatusUpdated(ZEROX_STATUSES.STARTED)
  ),
  [SubscriptionEventName.ZeroXStatusRestarting]: wrapLogHandler(
    () => handleZeroStatusUpdated(ZEROX_STATUSES.RESTARTING)
  ),
  [SubscriptionEventName.ZeroXStatusError]: wrapLogHandler(
    (log: any) => handleZeroStatusUpdated(ZEROX_STATUSES.ERROR, log)
  ),
  [SubscriptionEventName.ZeroXStatusSynced]: wrapLogHandler(
    () => handleZeroStatusUpdated(ZEROX_STATUSES.SYNCED)
  ),
  [SubscriptionEventName.BulkOrderEvent]: wrapLogHandler(handleBulkOrdersLog),
};

const EVENTS = {
  [SubscriptionEventName.NewBlock]: wrapLogHandler(handleNewBlockLog),
  [SubscriptionEventName.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventName.TradingProceedsClaimed]: wrapLogHandler(
    handleTradingProceedsClaimedLog
  ),
  [SubscriptionEventName.UniverseForked]: wrapLogHandler(
    handleUniverseForkedLog
  ),
  [SubscriptionEventName.ReportingStateChanged]: wrapLogHandler(
    handleReportingStateChanged
  ),
  [SubscriptionEventName.WarpSyncHashUpdated]: wrapLogHandler(
    handleWarpSyncHashUpdatedLog
  ),
  [SubscriptionEventName.OrderEvent]: wrapLogHandler(
    handleOrderLog
  ),

  [TXEventName.AwaitingSigning]: wrapLogHandler(handleTxAwaitingSigning),
  [TXEventName.Success]: wrapLogHandler(handleTxSuccess),
  [TXEventName.Pending]: wrapLogHandler(handleTxPending),
  [TXEventName.Failure]: wrapLogHandler(handleTxFailure),
  [TXEventName.RelayerDown]: wrapLogHandler(handleTxRelayerDown),
  [TXEventName.FeeTooLow]: wrapLogHandler(handleTxFeeTooLow),
};

export const listenToUpdates = (augur: Augur<Provider>) => (
  dispatch: ThunkDispatch<void, any, Action>
) =>
  Object.keys(EVENTS).map((eventName) => {
    const eventCallback = EVENTS[eventName];
    augur.on(eventName, (log) => dispatch(eventCallback(log)));
  });

export const listenForStartUpEvents = (augur: Augur<Provider>) => (
  dispatch: ThunkDispatch<void, any, Action>
) =>
  Object.keys(START_UP_EVENTS).map((eventName) => {
    const eventCallback = START_UP_EVENTS[eventName];
    augur.on(eventName, (log) => dispatch(eventCallback(log)));
  });

export const unListenToEvents = (augur: Augur<Provider>) => {
  Object.keys(EVENTS).map((eventName) => {
    augur.off(eventName);
  });
  Object.keys(START_UP_EVENTS).map((eventName) => {
    augur.off(eventName);
  });
};
