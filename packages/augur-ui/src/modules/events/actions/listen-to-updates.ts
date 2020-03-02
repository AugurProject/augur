import {
  handleMarketMigratedLog,
  handleMarketsUpdatedLog,
  handleNewBlockLog,
  handleOrderLog,
  handleTradingProceedsClaimedLog,
  handleTxAwaitingSigning,
  handleTxFailure,
  handleTxPending,
  handleTxSuccess,
  handleUniverseForkedLog,
  handleTxRelayerDown,
  handleTxFeeTooLow,
  handleSDKReadyEvent,
  handleGnosisStateUpdate,
  handleReportingStateChanged,
  handleWarpSyncHashUpdatedLog,
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
  [SubscriptionEventName.MarketMigrated]: wrapLogHandler(
    handleMarketMigratedLog
  ),
  [SubscriptionEventName.OrderEvent]: wrapLogHandler(handleOrderLog),
  [SubscriptionEventName.TradingProceedsClaimed]: wrapLogHandler(
    handleTradingProceedsClaimedLog
  ),
  [SubscriptionEventName.UniverseForked]: wrapLogHandler(
    handleUniverseForkedLog
  ),
  [SubscriptionEventName.MarketsUpdated]: wrapLogHandler(
    handleMarketsUpdatedLog
  ),
  [SubscriptionEventName.GnosisSafeStatus]: wrapLogHandler(
    handleGnosisStateUpdate
  ),
  [SubscriptionEventName.ReportingStateChanged]: wrapLogHandler(
    handleReportingStateChanged
  ),
  [SubscriptionEventName.WarpSyncHashUpdated]: wrapLogHandler(
    handleWarpSyncHashUpdatedLog
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
