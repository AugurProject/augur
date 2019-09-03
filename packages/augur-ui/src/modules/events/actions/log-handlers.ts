import { addAlert, updateAlert } from 'modules/alerts/actions/alerts';
import {
  loadMarketAccountPositions,
  loadAccountPositionsTotals,
} from 'modules/positions/actions/load-account-positions';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-order-book';
import { removeMarket } from 'modules/markets/actions/update-markets-data';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import makePath from 'modules/routes/helpers/make-path';
import { TRANSACTIONS } from 'modules/routes/constants/views';
import loadCategories from 'modules/categories/actions/load-categories';
import {
  loadMarketsInfo,
  loadMarketsInfoIfNotLoaded,
} from 'modules/markets/actions/load-markets-info';
import {
  loadMarketTradingHistory,
  loadUserFilledOrders,
} from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { isSameAddress } from 'utils/isSameAddress';
import { Events, Logs } from '@augurproject/sdk';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { Augur } from '@augurproject/sdk';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { loadAccountData } from 'modules/auth/actions/load-account-data';

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
  // dispatch(getWinningBalance([marketId]));
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

export const handleSDKReadyEvent = () => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  // wire up events for sdk
  augurSdk.subscribe(dispatch);
  // app is connected when subscribed to sdk
  dispatch(updateConnectionStatus(true));
};

export const handleUserDataSyncedEvent = (log: Events.UserDataSynced) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount } = getState();
  const { mixedCaseAddress } = loginAccount;
  if (mixedCaseAddress && log.trackedUsers.includes(mixedCaseAddress)) {
    dispatch(updateAuthStatus(IS_LOGGED, true));
    dispatch(loadAccountData());
  }
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
  // update assets each block
  if (getState().authStatus.isLogged) {
    dispatch(updateAssets());
    dispatch(checkAccountAllowance());
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
    dispatch(loadMarketsInfo([log.market]));
  }
  if (isStoredTransaction) {
    // TODO: could tell that logged in user can create liquidity orders
    // My Market? start kicking off liquidity orders
    // if (!log.removed) dispatch(startOrderSending({ marketId: log.market }));
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

export const handleTokenBalanceChangedLog = (
  log: Logs.TokenBalanceChangedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = isSameAddress(log.owner, address);
  if (isStoredTransaction) {
    // dispatch(loadReportingWindowBounds());
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

export const handleTradingProceedsClaimedLog = (
  log: Logs.TradingProceedsClaimedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const isStoredTransaction = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isCurrentMarket(log.market)) dispatch(loadMarketOrderBook(log.market));
};

export const handleInitialReportSubmittedLog = (
  log: Logs.InitialReportSubmittedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  //dispatch(loadReporting([log.market]));
  const isStoredTransaction = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    // dispatch(loadDisputing());
  }
};

export const handleInitialReporterRedeemedLog = (
  log: Logs.InitialReporterRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  const isStoredTransaction = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    // dispatch(loadReporting([log.market]));
    // dispatch(loadDisputing());
  }
  // dispatch(getReportingFees());
};

export const handleProfitLossChangedLog = (log: Logs.ProfitLossChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleProfitLossChangedLog');
  const isStoredTransaction = isSameAddress(
    log.account,
    getState().loginAccount.address
  );
  if (isStoredTransaction) {
    dispatch(loadUserPositionsAndBalances(log.market));
  }
};

export const handleInitialReporterTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleInitialReporterTransferredLog');
};

export const handleParticipationTokensRedeemedLog = (
  log: Logs.ParticipationTokensRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  console.log('handleParticipationTokensRedeemedLog');
};

export const handleReportingParticipantDisavowedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleReportingParticipantDisavowedLog');
};

export const handleMarketParticipantsDisavowedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketParticipantsDisavowedLog');
};

export const handleMarketTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketTransferredLog');
};

export const handleMarketVolumeChangedLog = (
  log: Logs.MarketVolumeChangedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  console.log('handleMarketVolumeChangedLog');
};

export const handleMarketOIChangedLog = (log: Logs.MarketOIChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketOIChangedLog');
};

export const handleUniverseForkedLog = (log: Logs.UniverseForkedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleUniverseForkedLog');
};

export const handleMarketFinalizedLog = (log: Logs.MarketFinalizedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) =>
  dispatch(
    loadMarketsInfo([log.market], (err: any) => {
      if (err) return console.error(err);
      // dispatch(getWinningBalance([log.market]));
    })
  );

export const handleDisputeCrowdsourcerCreatedLog = (
  log: Logs.DisputeCrowdsourcerCreatedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(loadMarketsInfo([log.market]));
  // dispatch(loadReportingWindowBounds());
};

export const handleDisputeCrowdsourcerContributionLog = (
  log: Logs.DisputeCrowdsourcerContributionLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  if (log.reporter === getState().loginAccount.address) {
    // dispatch(loadReportingWindowBounds());
  }
};

export const handleDisputeCrowdsourcerCompletedLog = (
  log: Logs.DisputeCrowdsourcerCompletedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(loadMarketsInfo([log.market]));
  // dispatch(loadReportingWindowBounds());
};

export const handleDisputeCrowdsourcerRedeemedLog = (
  log: Logs.DisputeCrowdsourcerRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(loadMarketsInfo([log.market]));
  // dispatch(loadReportingWindowBounds());
  // dispatch(getReportingFees());
};

export const handleDisputeWindowCreatedLog = (
  log: Logs.DisputeWindowCreatedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  // dispatch(loadReportingWindowBounds());
  // dispatch(getReportingFees());
};
