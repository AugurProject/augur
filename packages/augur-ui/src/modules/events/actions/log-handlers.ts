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
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { isSameAddress } from 'utils/isSameAddress';
import { Events, Logs } from '@augurproject/sdk';
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

const loadUserPositionsAndBalances = (marketId: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketAccountPositions(marketId));
  dispatch(getWinningBalance([marketId]));
};

export const handleTxAwaitingSigning = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('AwaitingSigning Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxSuccess = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxSuccess Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxPending = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxPending Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFailure = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFailure Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleNewBlockLog = (log: Events.NewBlock) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(
    updateBlockchain({
      currentBlockNumber: log.highestAvailableBlockNumber,
      blocksBehindCurrent: log.blocksBehindCurrent,
      lastSyncedBlockNumber: log.lastSyncedBlockNumber,
      percentSynced: log.percentSynced,
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
  // update assets each block
  dispatch(updateAssets());
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
    // TODO: will need to update user's contribution to dispute/reporting
    // dispatch(loadReportingWindowBounds());
  }
};

export const handleTokenBalanceChangedLog = (log: Logs.TokenBalanceChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = isSameAddress(log.owner, address);
  if (isStoredTransaction) {
    dispatch(loadReportingWindowBounds());
    dispatch(defaultLogHandler(log));
  }
};

export const handleOrderLog = (log: any) => {
  const type = log.eventType;
  switch (type) {
    case Logs.OrderEventType.Cancel: {
      return handleOrderCanceledLog(log);
    }
    case Logs.OrderEventType.Create: {
      return handleOrderCreatedLog(log);
    }
    case Logs.OrderEventType.PriceChanged: {
      // TODO: figure out what needs to change for price change
      return console.log('order price changed need to add UI functionality');
    }
    default:
      return handleOrderFilledLog(log);
  }
};

export const handleOrderCreatedLog = (log: Logs.ParsedOrderEventLog) => (
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
    dispatch(loadAccountOpenOrders({ marketId }));
    dispatch(loadAccountPositionsTotals());
  }
  if (isCurrentMarket(marketId)) dispatch(loadMarketOrderBook(marketId));
};

export const handleOrderCanceledLog = (log: Logs.ParsedOrderEventLog) => (
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
    dispatch(loadAccountOpenOrders({ marketId }));
    dispatch(loadAccountPositionsTotals());
  }
  if (isCurrentMarket(marketId)) dispatch(loadMarketOrderBook(marketId));
};

export const handleOrderFilledLog = (log: Logs.ParsedOrderEventLog) => (
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
    dispatch(loadUserFilledOrders({ marketId }));
    dispatch(loadAccountOpenOrders({ marketId }));
  }
  dispatch(loadMarketTradingHistory(marketId));
  if (isCurrentMarket(marketId)) dispatch(loadMarketOrderBook(marketId));
};

export const handleTradingProceedsClaimedLog = (log: Logs.TradingProceedsClaimedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const isStoredTransaction = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(updateLoggedTransactions(log));
  }
  if (isCurrentMarket(log.market)) dispatch(loadMarketOrderBook(log.market));
};


export const handleInitialReportSubmittedLog = (log: Logs.InitialReportSubmittedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadReporting([log.market]));
  const isStoredTransaction = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
};

export const handleInitialReporterRedeemedLog = (log: Logs.InitialReporterRedeemedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(loadMarketsInfo([log.market]));
  const isStoredTransaction = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(loadReporting([log.market]));
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
  dispatch(getReportingFees());
};

export const handleProfitLossChangedLog = (log: Logs.ProfitLossChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleProfitLossChangedLog");
  const isStoredTransaction = isSameAddress(
    log.account,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(loadUserPositionsAndBalances(log.market));
  }
}

export const handleInitialReporterTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleInitialReporterTransferredLog");
}

export const handleParticipationTokensRedeemedLog = (log: Logs.ParticipationTokensRedeemedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleParticipationTokensRedeemedLog");
}

export const handleReportingParticipantDisavowedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleReportingParticipantDisavowedLog");
}

export const handleMarketParticipantsDisavowedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleMarketParticipantsDisavowedLog");
}

export const handleMarketTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleMarketTransferredLog");
}

export const handleMarketVolumeChangedLog = (log: Logs.MarketVolumeChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleMarketVolumeChangedLog");
}

export const handleMarketOIChangedLog = (log: Logs.MarketOIChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleMarketOIChangedLog");
}


export const handleUniverseForkedLog = (log: Logs.UniverseForkedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log("handleUniverseForkedLog");
}

export const handleMarketFinalizedLog = (log: Logs.MarketFinalizedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) =>
  dispatch(
    loadMarketsInfo([log.market], (err: any) => {
      if (err) return console.error(err);
      const { author } = getState().marketInfos[log.market];
      dispatch(loadMarketsInfo([log.market]));
      dispatch(getWinningBalance([log.market]));
      const isOwnMarket = getState().loginAccount.address === author;
      if (isOwnMarket) {
        dispatch(updateLoggedTransactions(log));
      }
    })
  );

export const handleDisputeCrowdsourcerCreatedLog = (log: Logs.DisputeCrowdsourcerCreatedLog) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
};

export const handleDisputeCrowdsourcerContributionLog = (log: Logs.DisputeCrowdsourcerContributionLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(defaultLogHandler(log));
  if (log.reporter === getState().loginAccount.address) {
    dispatch(loadReportingWindowBounds());
  }
};

export const handleDisputeCrowdsourcerCompletedLog = (log: Logs.DisputeCrowdsourcerCompletedLog) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
};

export const handleDisputeCrowdsourcerRedeemedLog = (log: Logs.DisputeCrowdsourcerRedeemedLog) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
  dispatch(getReportingFees());
};

export const handleDisputeWindowCreatedLog = (log: Logs.DisputeWindowCreatedLog) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  dispatch(loadReportingWindowBounds());
  dispatch(getReportingFees());
};

