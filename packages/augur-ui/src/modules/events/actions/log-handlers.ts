import { Getters } from '@augurproject/sdk/build';
import { updateAlert } from 'modules/alerts/actions/alerts';
import {
  loadAccountPositionsTotals,
  loadMarketAccountPositions,
} from 'modules/positions/actions/load-account-positions';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-order-book';
import { removeMarket, updateMarketsData, } from 'modules/markets/actions/update-markets-data';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import { loadMarketsInfo, } from 'modules/markets/actions/load-markets-info';
import {
  loadMarketTradingHistory,
  loadUserFilledOrders,
} from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { MarketInfos } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { isSameAddress } from 'utils/isSameAddress';
import { Events, Logs, TXEventName } from '@augurproject/sdk';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import {
  CANCELORDER,
  CLAIMTRADINGPROCEEDS,
  CONTRIBUTE,
  CREATEMARKET,
  DOINITIALREPORT,
  PUBLICFILLORDER,
  PUBLICTRADE,
} from 'modules/common/constants';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { isOnDisputingPage, isOnReportingPage, } from 'modules/trades/helpers/is-on-page';
import { reloadDisputingPage, reloadReportingPage, } from 'modules/reporting/actions/update-reporting-list';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { getCategoryStats } from 'modules/create-market/actions/get-category-stats';
import { GNOSIS_STATUS, updateAppStatus, } from 'modules/app/actions/update-app-status';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api/build/GnosisRelayAPI';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { marketCreationCreated, orderFilled } from 'services/analytics/helpers';

const handleAlert = (
  log: any,
  name: string,
  toast: boolean,
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
  try {
    dispatch(
      updateAlert(log.transactionHash, {
        params: log,
        toast: toast,
        status: TXEventName.Success,
        timestamp: blockchain.currentAugurTimestamp * 1000,
        name,
      })
    );
  } catch (e) {
    console.error('alert could not be created', e);
  }
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
  dispatch(updateAssets());
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

export const handleGnosisStateUpdate = (response) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  // TODO This isn't getting hit
  console.log('handleGnosisStateUpdate', response);
};

export const handleSDKReadyEvent = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  // wire up events for sdk
  augurSdk.subscribe(dispatch);

  // app is connected when subscribed to sdk
  dispatch(updateConnectionStatus(true));
  dispatch(loadUniverseForkingInfo());
  dispatch(getCategoryStats())
};

export const handleNewBlockLog = (log: Events.NewBlock) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain } = getState();
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
    dispatch(loadAnalytics(getState().analytics, blockchain.currentAugurTimestamp));
  }

  if (
    getState().appStatus.gnosisEnabled &&
    getState().appStatus.gnosisStatus !== GnosisSafeState.AVAILABLE
  ) {
    const status = augurSdk.sdk.gnosis.augur.getGnosisStatus();
    if (status) {
      dispatch(updateAppStatus(GNOSIS_STATUS, status));
    }
  }
};

export const handleMarketsUpdatedLog = (
    {marketsInfo = []}: {marketsInfo:Getters.Markets.MarketInfo[] | Getters.Markets.MarketInfo}
  ) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  console.log('handleMarketsUpdatedChangedLog');

  let marketsDataById = {}
  if (Array.isArray(marketsInfo)) {
    marketsDataById = marketsInfo.reduce((acc, marketData) => ({
      [marketData.id]: marketData,
      ...acc,
    }), {} as MarketInfos);
  } else {
    const market = marketsInfo as Getters.Markets.MarketInfo;
    marketsDataById[market.id] = market;
  }

  dispatch(updateMarketsData(marketsDataById));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage());
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
  }
  if (isUserDataUpdate) {
    handleAlert(log, CREATEMARKET, false, dispatch, getState);
    dispatch(marketCreationCreated(log.market, log.extraInfo));
    dispatch(loadMarketsInfo([log.market]));
  }
};

export const handleMarketMigratedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const universeId = getState().universe.id;
  const userAddress = getState().loginAccount.address;
  if (log.originalUniverse === universeId) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  dispatch(loadUniverseDetails(universeId, userAddress));
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
    handleAlert(log, PUBLICTRADE, false, dispatch, getState);

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
    //handleAlert(log, CANCELORDER, dispatch, getState);
    const { blockchain } = getState();
    dispatch(
      updateAlert(log.orderId, {
        name: CANCELORDER,
        timestamp: blockchain.currentAugurTimestamp * 1000,
        status: TXEventName.Success,
        params: { ...log },
      })
    );
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
    handleAlert(log, PUBLICFILLORDER, true, dispatch, getState);
    dispatch(loadUserFilledOrders({ marketId }));
    dispatch(loadAccountOpenOrders({ marketId }));
    dispatch(orderFilled(marketId, log, isSameAddress(log.orderCreator, address)));
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
  if (isUserDataUpdate) {
    // handleAlert(log, CLAIMTRADINGPROCEEDS, dispatch, getState);
    const { blockchain } = getState();
    dispatch(
      updateAlert(log.market, {
        name: CLAIMTRADINGPROCEEDS,
        timestamp: blockchain.currentAugurTimestamp * 1000,
        status: TXEventName.Success,
        params: { ...log },
      })
    );
  }

  if (isCurrentMarket(log.market)) dispatch(loadMarketOrderBook(log.market));
};

// ---- initial reporting ----- //
export const handleInitialReportSubmittedLog = (
  log: Logs.InitialReportSubmittedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const isUserDataUpdate = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    handleAlert(log, DOINITIALREPORT, false, dispatch, getState);
    dispatch(loadAccountReportingHistory());
  }
  if (isOnReportingPage()) dispatch(reloadReportingPage());
};

export const handleInitialReporterRedeemedLog = (
  log: Logs.InitialReporterRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
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
  if (isOnReportingPage()) dispatch(reloadReportingPage());
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
  const { forkingMarket } = log;
  dispatch(loadUniverseForkingInfo(forkingMarket));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage());
};

export const handleMarketFinalizedLog = (log: Logs.MarketFinalizedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  if (universe.forkingInfo) {
    if (log.market === universe.forkingInfo.forkingMarket) {
      dispatch(loadUniverseForkingInfo())
    }
  }
}

// ---- disputing ----- //
export const handleDisputeCrowdsourcerCreatedLog = (
  log: Logs.DisputeCrowdsourcerCreatedLog
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage());
};

export const handleDisputeCrowdsourcerContributionLog = (
  log: Logs.DisputeCrowdsourcerContributionLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const isUserDataUpdate = isSameAddress(
    log.reporter,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    handleAlert(log, CONTRIBUTE, false, dispatch, getState);
    dispatch(loadAccountReportingHistory());
  }
  if (isOnDisputingPage()) dispatch(reloadDisputingPage());
};

export const handleDisputeCrowdsourcerCompletedLog = (
  log: Logs.DisputeCrowdsourcerCompletedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  handleAlert(log, CONTRIBUTE, false, dispatch, getState);
  if (isOnDisputingPage()) dispatch(reloadDisputingPage());
};

export const handleDisputeCrowdsourcerRedeemedLog = (
  log: Logs.DisputeCrowdsourcerRedeemedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
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
  dispatch(loadAccountReportingHistory());
  if (isOnDisputingPage()) dispatch(reloadDisputingPage());
};

export const handleTokensMintedLog = (
  log: Logs.TokensMinted
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const userAddress = getState().loginAccount.address;
  const isForking = !!getState().universe.forkingInfo;
  if(log.tokenType === Logs.TokenType.ParticipationToken) {
    const isUserDataUpdate = isSameAddress(
      log.target,
      userAddress
    );
    if (isUserDataUpdate) {
      dispatch(loadAccountReportingHistory());
    }
    dispatch(loadDisputeWindow());
  }
  if (log.tokenType === Logs.TokenType.ReputationToken && isForking) {
    const isUserDataUpdate = isSameAddress(
      log.target,
      userAddress
    );
    if (isUserDataUpdate) {
      dispatch(loadUniverseDetails(log.universe, userAddress))
    }
  }
};
