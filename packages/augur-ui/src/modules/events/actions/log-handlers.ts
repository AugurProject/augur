import { addAlert, updateAlert } from 'modules/alerts/actions/alerts';
import {
  loadMarketAccountPositions,
  loadAccountPositionsTotals,
} from 'modules/positions/actions/load-account-positions';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-order-book';
import { loadReportingWindowBounds } from 'modules/reports/actions/load-reporting-window-bounds';
import { updateLoggedTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { removeMarket } from 'modules/markets/actions/update-markets-data';
import { updateOutcomePrice } from 'modules/markets/actions/update-outcome-price';
import { defaultLogHandler } from 'modules/events/actions/default-log-handler';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import logError from 'utils/log-error';
import makePath from 'modules/routes/helpers/make-path';
import { MY_MARKETS, TRANSACTIONS } from 'modules/routes/constants/views';
import { loadReporting } from 'modules/reports/actions/load-reporting';
import { loadDisputing } from 'modules/reports/actions/load-disputing';
import loadCategories from 'modules/categories/actions/load-categories';
import { getReportingFees } from 'modules/reports/actions/get-reporting-fees';
import {
  loadMarketsInfo,
  loadMarketsInfoIfNotLoaded,
  loadMarketsDisputeInfo,
} from 'modules/markets/actions/load-markets-info';
import { getWinningBalance } from 'modules/reports/actions/get-winning-balance';
import { startOrderSending } from 'modules/orders/actions/liquidity-management';
import {
  loadMarketTradingHistory,
  loadUserFilledOrders,
} from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { appendCategoryIfNew } from 'modules/categories/actions/append-category';
import { removePendingOrder } from 'modules/orders/actions/pending-orders-management';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { isSameAddress } from 'utils/isSameAddress';
import {
  OrderEventType,
  ParsedOrderEventLog,
} from '@augurproject/sdk/src/state/logs/types';
import { TXStatus } from '@augurproject/sdk/src/events';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';

const handleAlertUpdate = (
  log: any,
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    updateAlert(log.transactionHash, {
      id: log.transactionHash,
      timestamp: selectCurrentTimestampInSeconds(getState()),
      blockNumber: log.blockNumber,
      log,
      status: 'Confirmed',
      linkPath: makePath(TRANSACTIONS),
      seen: false, // Manually set to false to ensure alert
    })
  );
};

const handlePendingOrder = (
  log: any,
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(removePendingOrder(log.transactionHash, log.marketId));
};

const loadUserPositionsAndBalances = (marketId: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketAccountPositions(marketId));
  dispatch(getWinningBalance([marketId]));
};

export const handleTxAwaitingSigning = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('AwaitingSigning Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxSuccess = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxSuccess Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxPending = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxPending Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFailure = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFailure Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleNewBlockLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    updateBlockchain({
      currentBlockNumber: log.highestAvailableBlockNumber,
      blocksBehindCurrent: log.blocksBehindCurrent,
      lastSyncedBlockNumber: log.lastSyncedBlockNumber,
      percentBehindCurrent: log.percentBehindCurrent,
      currentAugurTimestamp: log.timestamp,
    })
  );
  // TODO: figure out a good way to know if SDK is ready to subscribe to events
  if (log.blocksBehindCurrent === 0 && !augurSdk.isSubscribed) {
    // wire up events for sdk
    augurSdk.subscribe(dispatch);
    // app is connected when subscribed to sdk
    dispatch(updateConnectionStatus(true));
  }
};

export const handleMarketCreatedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const isStoredTransaction = isSameAddress(
    log.marketCreator,
    getState().loginAccount.address
  );
  if (log.removed) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(
      loadMarketsInfo([log.market], (err: any) => {
        if (err) {
          logError(err);
          return;
        }

        // When a new market is created, we might reload all categories with
        // `dispatch(loadCategories())`, but this can cause UI jitter, so
        // instead we'll append the new market's category if it doesn't exist.
        appendCategoryIfNew(
          dispatch,
          getState().categories,
          getState().marketInfos[log.market]
        );
      })
    );
    // dispatch(loadCategories()); don't reload categories because when market created log comes in, this event will cause the categories to load and re-sort which causes the category list to change. If markets are being traded (OI an change) then multiple markets are getting created there is potential for the user's category list to appear erratic as the list resorts over and over. In future, we might check if the new market's category is new, and append that category to end of categories without user seeing a jittery re-render.
  }
  if (isStoredTransaction) {
    handleAlertUpdate(log, dispatch, getState);
    dispatch(updateAssets());

    // My Market? start kicking off liquidity orders
    if (!log.removed) dispatch(startOrderSending({ marketId: log.market }));
    dispatch(updateLoggedTransactions(log));
  }
};

export const handleMarketMigratedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const universeId = getState().universe.id;
  if (log.originalUniverse === universeId) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  dispatch(loadCategories());
};

export const handleTokensTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction =
    isSameAddress(log.from, address) || isSameAddress(log.to, address);
  if (isStoredTransaction) {
    dispatch(updateAssets());
    // TODO: will need to update user's contribution to dispute/reporting
    // dispatch(loadReportingWindowBounds());
    handleAlertUpdate(log, dispatch, getState);
  }
};

export const handleTokensMintedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = isSameAddress(log.target, address);
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(loadReportingWindowBounds());
    dispatch(defaultLogHandler(log));
  }
};

export const handleTokensBurnedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = isSameAddress(log.target, address);
  if (isStoredTransaction) {
    handleAlertUpdate(log, dispatch, getState);
  }
};

export const handleOrderLog = (log: any) => {
  const type = log.eventType;
  switch (type) {
    case OrderEventType.Cancel: {
      return handleOrderCanceledLog(log);
    }
    case OrderEventType.Create: {
      return handleOrderCreatedLog(log);
    }
    case OrderEventType.PriceChanged: {
      // TODO: figure out what needs to change for price change
      return console.log('order price changed need to add UI functionality');
    }
    default:
      return handleOrderFilledLog(log);
  }
};

export const handleOrderCreatedLog = (log: ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketId = log.market;
  const isStoredTransaction = isSameAddress(
    log.orderCreator,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(loadMarketsInfoIfNotLoaded([marketId]));
    dispatch(updateAssets());
    // handlePendingOrder(log, dispatch, getState);
    // handleAlertUpdate(log, dispatch, getState);
    dispatch(loadAccountOpenOrders({ marketId }));
    dispatch(loadAccountPositionsTotals());
  }
  if (isCurrentMarket(marketId)) dispatch(loadMarketOrderBook(marketId));
};

export const handleOrderCanceledLog = (log: ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketId = log.market;
  const isStoredTransaction = isSameAddress(
    log.orderCreator,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    // TODO: do we need to remove stuff based on events?
    // if (!log.removed) dispatch(removeCanceledOrder(log.orderId));
    dispatch(updateAssets());
    dispatch(loadAccountOpenOrders({ marketId }));
    dispatch(loadAccountPositionsTotals());
  }
  if (isCurrentMarket(marketId)) dispatch(loadMarketOrderBook(marketId));
};

export const handleOrderFilledLog = (log: ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketId = log.market;
  const { address } = getState().loginAccount;
  const isStoredTransaction =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isStoredTransaction) {
    dispatch(loadMarketsInfo([marketId]));
    dispatch(updateAssets());
    // handlePendingOrder(log, dispatch, getState);
    // handleAlertUpdate(log, dispatch, getState);
    dispatch(updateOutcomePrice(marketId, log.outcome, log.price));
    dispatch(loadUserFilledOrders({ marketId }));
    dispatch(loadAccountOpenOrders({ marketId }));
  }
  // always reload account positions on trade so we get up to date PL data.
  dispatch(loadUserPositionsAndBalances(marketId));
  dispatch(loadMarketTradingHistory(marketId));
  if (isCurrentMarket(marketId)) dispatch(loadMarketOrderBook(marketId));
};

export const handleTradingProceedsClaimedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const isStoredTransaction = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(updateLoggedTransactions(log));
    dispatch(loadUserPositionsAndBalances(log.market));
  }
  if (isCurrentMarket(log.market)) dispatch(loadMarketOrderBook(log.market));
};

export const handleInitialReportSubmittedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadMarketsDisputeInfo([log.market]));
  dispatch(loadReporting([log.market]));
  const isStoredTransaction = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    handleAlertUpdate(log, dispatch, getState);
    dispatch(updateAssets());
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
};

export const handleInitialReporterRedeemedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(loadMarketsInfo([log.market]));
  const isStoredTransaction = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(loadReporting([log.market]));
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
  dispatch(getReportingFees());
};

export const handleMarketFinalizedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) =>
  dispatch(
    loadMarketsInfo([log.market], (err: any) => {
      if (err) return console.error(err);
      const { author } = getState().marketInfos[log.market];
      dispatch(loadReporting([log.market]));
      dispatch(getWinningBalance([log.market]));
      const isOwnMarket = getState().loginAccount.address === author;
      if (isOwnMarket) {
        dispatch(updateAssets());
        dispatch(updateLoggedTransactions(log));
      }
      if (!log.removed) {
        const { alerts } = getState();
        const doesntExist = !alerts.filter(
          (alert: { id: any; params: { type: string } }) =>
            alert.id === log.transactionHash && alert.params.type === 'finalize'
        ).length;

        if (doesntExist && isOwnMarket) {
          // Trigger the alert addition here because calling other
          // API functions, such as `InitialReporter.redeem` can indirectly
          // cause a MarketFinalized event to be logged.
          dispatch(
            addAlert({
              id: `${log.transactionHash}_finalize`,
              timestamp: log.timestamp,
              blockNumber: log.blockNumber,
              log,
              params: {
                type: 'finalize',
              },
              status: 'Confirmed',
              linkPath: makePath(MY_MARKETS),
            })
          );
        } else if (!doesntExist) {
          handleAlertUpdate(log, dispatch, getState);
        }
      }
    })
  );

export const handleDisputeCrowdsourcerCreatedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
};

export const handleDisputeCrowdsourcerContributionLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(defaultLogHandler(log));
  if (log.reporter === getState().loginAccount.address) {
    dispatch(updateAssets());
    dispatch(loadReportingWindowBounds());
  }
};

export const handleDisputeCrowdsourcerCompletedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketsInfo([log.marketId]));
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
};

export const handleDisputeCrowdsourcerRedeemedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
  dispatch(getReportingFees());
};

export const handleFeeWindowCreatedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadReportingWindowBounds());
  dispatch(getReportingFees());
};

export const handleFeeWindowOpenedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadReportingWindowBounds());
  dispatch(getReportingFees());
};

export const handleFeeWindowRedeemedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(defaultLogHandler(log));
  dispatch(getReportingFees());
};
