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
import { Events, Logs, TXEventName } from '@augurproject/sdk';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { Augur } from '@augurproject/sdk';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { IS_LOGGED, updateAuthStatus } from 'modules/auth/actions/auth-status';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { loadAccountDataFromLocalStorage } from 'modules/auth/actions/load-account-data-from-local-storage';
import {
  CANCELORDER,
  PUBLICTRADE,
  CLAIMTRADINGPROCEEDS,
  DOINITIALREPORT,
  CREATEMARKET,
  PUBLICFILLORDER,
  CONTRIBUTE,
} from 'modules/common/constants';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';

const handleAlert = (
  log: any,
  name: string,
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
  dispatch(
    addAlert({
      id: log.transactionHash,
      params: log,
      status: TXEventName.Success,
      timestamp: blockchain.currentAugurTimestamp * 1000,
      name: name,
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
  const { mixedCaseAddress, address } = loginAccount;
  if (mixedCaseAddress && log.trackedUsers.includes(mixedCaseAddress)) {
    dispatch(loadAccountDataFromLocalStorage(address));
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
  const isUserDataUpdate = isSameAddress(
    log.marketCreator,
    getState().loginAccount.address
  );
  if (log.removed) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  if (isUserDataUpdate) {
    handleAlert(log, CREATEMARKET, dispatch, getState);
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
};

export const handleTokensTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  const isUserDataUpdate =
    isSameAddress(log.from, address) || isSameAddress(log.to, address);
  if (isUserDataUpdate) {
    // TODO: will need to update user's contribution to dispute/reporting
    // dispatch(loadReportingWindowBounds());
  }
};

export const handleTokenBalanceChangedLog = (
  log: Logs.TokenBalanceChangedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { address } = getState().loginAccount;
  const isUserDataUpdate = isSameAddress(log.owner, address);
  if (isUserDataUpdate) {
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
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    handleAlert(log, PUBLICTRADE, dispatch, getState);

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
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    // TODO: do we need to remove stuff based on events?
    // if (!log.removed) dispatch(removeCanceledOrder(log.orderId));
    handleAlert(log, CANCELORDER, dispatch, getState);
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
  const isUserDataUpdate =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isUserDataUpdate) {
    handleAlert(log, PUBLICFILLORDER, dispatch, getState);
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
  const isUserDataUpdate = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isUserDataUpdate)
    handleAlert(log, CLAIMTRADINGPROCEEDS, dispatch, getState);

  if (isCurrentMarket(log.market)) dispatch(loadMarketOrderBook(log.market));
};

// ---- initial reporting ----- //
export const handleInitialReportSubmittedLog = (
  log: Logs.InitialReportSubmittedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  //dispatch(loadReporting([log.market]));
  const isUserDataUpdate = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    handleAlert(log, DOINITIALREPORT, dispatch, getState);
    dispatch(loadAccountReportingHistory());
  }
};

export const handleInitialReporterRedeemedLog = (
  log: Logs.InitialReporterRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  const isUserDataUpdate = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    dispatch(loadAccountReportingHistory());
  }
};

export const handleInitialReporterTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleInitialReporterTransferredLog');
  const isUserDataUpdate =
    isSameAddress(log.from, getState().loginAccount.address) ||
    isSameAddress(log.to, getState().loginAccount.address);
  if (isUserDataUpdate) {
    dispatch(loadAccountReportingHistory());
  }
};
// ---- ------------ ----- //

export const handleProfitLossChangedLog = (log: Logs.ProfitLossChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleProfitLossChangedLog');
  const isUserDataUpdate = isSameAddress(
    log.account,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    dispatch(loadUserPositionsAndBalances(log.market));
  }
};

export const handleParticipationTokensRedeemedLog = (
  log: Logs.ParticipationTokensRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  console.log('handleParticipationTokensRedeemedLog');
  const isUserDataUpdate = isSameAddress(
    log.account,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    dispatch(loadAccountReportingHistory());
  }
};

export const handleReportingParticipantDisavowedLog = (
  log: Logs.ReportingParticipantDisavowedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  console.log('handleReportingParticipantDisavowedLog');
  const isUserDataUpdate = isSameAddress(
    log.reportingParticipant,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    dispatch(loadAccountReportingHistory());
  }
};

export const handleMarketParticipantsDisavowedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketParticipantsDisavowedLog');
  dispatch(loadMarketsInfo([log.market]));
};

export const handleMarketTransferredLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketTransferredLog');
  dispatch(loadMarketsInfo([log.market]));
};

export const handleMarketVolumeChangedLog = (
  log: Logs.MarketVolumeChangedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  console.log('handleMarketVolumeChangedLog');
  dispatch(loadMarketsInfo([log.market]));
};

export const handleMarketOIChangedLog = (log: Logs.MarketOIChangedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketOIChangedLog');
  dispatch(loadMarketsInfo([log.market]));
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
) => dispatch(loadMarketsInfo([log.market]));

// ---- disputing ----- //
export const handleDisputeCrowdsourcerCreatedLog = (
  log: Logs.DisputeCrowdsourcerCreatedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(loadMarketsInfo([log.market]));
};

export const handleDisputeCrowdsourcerContributionLog = (
  log: Logs.DisputeCrowdsourcerContributionLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  const isUserDataUpdate = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    handleAlert(log, CONTRIBUTE, dispatch, getState);
    dispatch(loadAccountReportingHistory());
  }
};

export const handleDisputeCrowdsourcerCompletedLog = (
  log: Logs.DisputeCrowdsourcerCompletedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  handleAlert(log, CONTRIBUTE, dispatch, getState);
};

export const handleDisputeCrowdsourcerRedeemedLog = (
  log: Logs.DisputeCrowdsourcerRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  dispatch(loadMarketsInfo([log.market]));
  const isUserDataUpdate = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    dispatch(loadAccountReportingHistory());
  }
};
// ---- ------------ ----- //

export const handleDisputeWindowCreatedLog = (
  log: Logs.DisputeWindowCreatedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(loadDisputeWindow());
};
