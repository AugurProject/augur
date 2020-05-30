import {
  handleMarketMigratedLog,
  handleMarketsUpdatedLog,
  handleNewBlockLog,
  handleTradingProceedsClaimedLog,
  handleTxEvents,
  handleUniverseForkedLog,
  handleSDKReadyEvent,
  handleReportingStateChanged,
  handleWarpSyncHashUpdatedLog,
  handleZeroStatusUpdated,
  handleBulkOrdersLog,
} from 'modules/events/actions/log-handlers';
import { wrapLogHandler } from 'modules/events/actions/wrap-log-handler';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Augur, Provider, SubscriptionEventName, TXEventName, } from '@augurproject/sdk';
import { ZEROX_STATUSES } from 'modules/common/constants';

const StartUpEvents = {
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
  [TXEventName.AwaitingSigning]: wrapLogHandler(handleTxEvents),
  [TXEventName.Success]: wrapLogHandler(handleTxEvents),
  [TXEventName.Pending]: wrapLogHandler(handleTxEvents),
  [TXEventName.Failure]: wrapLogHandler(handleTxEvents),
  [TXEventName.RelayerDown]: wrapLogHandler(handleTxEvents),
  [TXEventName.FeeTooLow]: wrapLogHandler(handleTxEvents),
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
