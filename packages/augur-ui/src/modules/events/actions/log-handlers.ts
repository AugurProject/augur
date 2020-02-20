import { Getters } from '@augurproject/sdk/build';
import { updateAlert } from 'modules/alerts/actions/alerts';
import {
  loadAllAccountPositions,
  loadAccountOnChainFrozenFundsTotals,
} from 'modules/positions/actions/load-account-positions';
import {
  removeMarket,
  updateMarketsData,
} from 'modules/markets/actions/update-markets-data';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import {
  loadMarketTradingHistory,
  loadUserFilledOrders,
} from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { MarketInfos } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { isSameAddress } from 'utils/isSameAddress';
import { Events, Logs, TXEventName, OrderEventType } from '@augurproject/sdk';
import {
  addUpdateTransaction,
  getRelayerDownErrorMessage,
} from 'modules/events/actions/add-update-transaction';
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
  MODAL_ERROR,
  REDEEMSTAKE,
  CREATE_MARKET,
  MODAL_GAS_PRICE,
} from 'modules/common/constants';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import {
  isOnDisputingPage,
  isOnReportingPage,
} from 'modules/trades/helpers/is-on-page';
import {
  reloadDisputingPage,
  reloadReportingPage,
} from 'modules/reporting/actions/update-reporting-list';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { getCategoryStats } from 'modules/create-market/actions/get-category-stats';
import {
  GNOSIS_STATUS,
  updateAppStatus,
} from 'modules/app/actions/update-app-status';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api/build/GnosisRelayAPI';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { marketCreationCreated, orderFilled } from 'services/analytics/helpers';
import { updateModal } from 'modules/modal/actions/update-modal';
import * as _ from 'lodash';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import { removePendingDataByHash } from 'modules/pending-queue/actions/pending-queue-management';

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
const ORDER_BOOK_REFRESH_MS = 1000;
const OPEN_ORDERS_REFRESH_MS = 2000;
const loadOrderBook = _.throttle((dispatch, marketId) => dispatch(loadMarketOrderBook(marketId)), ORDER_BOOK_REFRESH_MS, { leading: true });
const loadUserOpenOrders = _.throttle(dispatch => dispatch(loadAccountOpenOrders()), OPEN_ORDERS_REFRESH_MS, { leading: true });
const throttleLoadMarketOrders = (marketId) => dispatch => loadOrderBook(dispatch, marketId);
const throttleLoadUserOpenOrders = () => dispatch => loadUserOpenOrders(dispatch);

const updateMarketOrderBook = (marketId: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (isCurrentMarket(marketId)) {
    dispatch(throttleLoadMarketOrders(marketId));
  }
}

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

export const handleTxRelayerDown = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxRelayerDown Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFeeTooLow = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFeeTooLow Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
  dispatch(updateModal({ type: MODAL_GAS_PRICE, feeTooLow: true }));
};

export const handleGnosisStateUpdate = (response) => async(
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleGnosisStateUpdate', response);
  const status = response.status;
  if (response && status) {
    dispatch(updateAppStatus(GNOSIS_STATUS, status));

    if (status === GnosisSafeState.ERROR) {
      const loginAccount = getState().loginAccount;
      const hasEth = (await loginAccount.meta.signer.provider.getBalance(loginAccount.meta.signer._address)).gt(0);

      dispatch(updateModal({
        type: MODAL_ERROR,
        error: getRelayerDownErrorMessage(loginAccount.meta.accountType, hasEth),
        showDiscordLink: false,
        showAddFundsHelp: !hasEth,
        walletType: loginAccount.meta.accountType,
        title: 'We\'re having trouble processing transactions',
      }));
    }
  }
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
  dispatch(getCategoryStats());
};

export const handleNewBlockLog = (log: Events.NewBlock) => async (
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
    dispatch(
      loadAnalytics(getState().analytics, blockchain.currentAugurTimestamp)
    );
  }
};

export const handleMarketsUpdatedLog = ({
  marketsInfo = [],
}: {
  marketsInfo: Getters.Markets.MarketInfo[] | Getters.Markets.MarketInfo;
}) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleMarketsUpdatedChangedLog');
  let marketsDataById = {};
  if (Array.isArray(marketsInfo)) {
    if (marketsInfo.length === 0) return;
    marketsDataById = marketsInfo.reduce(
      (acc, marketData) => ({
        [marketData.id]: marketData,
        ...acc,
      }),
      {} as MarketInfos
    );
  } else {
    const market = marketsInfo as Getters.Markets.MarketInfo;
    if (Object.keys(market).length === 0) return;
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
  }
};

export const handleDBMarketCreatedEvent = (event: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (event.data) {
    const marketIds = _.map(event.data, 'market');
    dispatch(
      loadMarketsInfo(marketIds, (err, marketInfos) =>
        Object.keys(marketInfos).map(id => {
          const market = marketInfos[id]
          if (market) {
            dispatch(removePendingDataByHash(market.transactionHash, CREATE_MARKET))
            if (isSameAddress(market.author, getState().loginAccount.address)) {
              dispatch(loadAccountOnChainFrozenFundsTotals());
            }
          }
        })
      )
    );
  }
};

export const handleReportingStateChanged = (event: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (event.data) {
    const marketIds = _.map(event.data, 'market');
    dispatch(loadMarketsInfo(marketIds));
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
    case OrderEventType.Create:
      return handleOrderCreatedLog(log);
    case OrderEventType.Expire:
    case OrderEventType.Cancel:
      return handleOrderCanceledLog(log);
    case OrderEventType.Fill:
      return handleOrderFilledLog(log);
    default:
      console.log(`Unknown order event type "${log.eventType}" for log`, log);
  }
  return null;
};

export const handleOrderCreatedLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    loginAccount.mixedCaseAddress
  );
  if (isUserDataUpdate && authStatus.isLogged) {
    handleAlert(log, PUBLICTRADE, false, dispatch, getState);
    dispatch(throttleLoadUserOpenOrders());
  }
  dispatch(updateMarketOrderBook(log.market));
};

export const handleOrderCanceledLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    loginAccount.mixedCaseAddress
  );
  if (isUserDataUpdate) {
    // TODO: do we need to remove stuff based on events?
    // if (!log.removed) dispatch(removeCanceledOrder(log.orderId));
    //handleAlert(log, CANCELORDER, dispatch, getState);
    const { blockchain } = getState();
    if (authStatus.isLogged) {
      dispatch(
        updateAlert(log.orderId, {
          name: CANCELORDER,
          timestamp: blockchain.currentAugurTimestamp * 1000,
          status: TXEventName.Success,
          params: { ...log },
        })
      );
      dispatch(throttleLoadUserOpenOrders());
    }
  }
  dispatch(updateMarketOrderBook(log.market));
};

export const handleOrderFilledLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const marketId = log.market;
  const { address } = loginAccount;
  const isUserDataUpdate =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isUserDataUpdate && authStatus.isLogged) {
    dispatch(
      orderFilled(marketId, log, isSameAddress(log.orderCreator, address))
    );
    dispatch(loadUserFilledOrders({ marketId }));
    dispatch(throttleLoadUserOpenOrders());
    handleAlert(log, PUBLICFILLORDER, true, dispatch, getState);
  }
  dispatch(loadMarketTradingHistory(marketId));
  dispatch(updateMarketOrderBook(log.market));
};

export const handleTradingProceedsClaimedLog = (
  log: Logs.TradingProceedsClaimedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const isUserDataUpdate = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    dispatch(loadAllAccountPositions());
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
    dispatch(loadAllAccountPositions());
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
    handleAlert(
      { ...log, marketId: 1 },
      REDEEMSTAKE,
      false,
      dispatch,
      getState
    );
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
  const { universe, accountPositions } = getState();
  if (universe.forkingInfo) {
    if (log.market === universe.forkingInfo.forkingMarket) {
      dispatch(loadUniverseForkingInfo());
    }
  }
  const positionMarketids = Object.keys(accountPositions);
  const updatePositions =
    positionMarketids.length > 0 &&
    Object.keys(positionMarketids).includes(log.market);
  if (updatePositions) {
    dispatch(loadAllAccountPositions());
  }
};

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

export const handleTokensMintedLog = (log: Logs.TokensMinted) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const userAddress = getState().loginAccount.address;
  const isForking = !!getState().universe.forkingInfo;
  if (log.tokenType === Logs.TokenType.ParticipationToken) {
    const isUserDataUpdate = isSameAddress(log.target, userAddress);
    if (isUserDataUpdate) {
      dispatch(loadAccountReportingHistory());
    }
    dispatch(loadDisputeWindow());
  }
  if (log.tokenType === Logs.TokenType.ReputationToken && isForking) {
    const isUserDataUpdate = isSameAddress(log.target, userAddress);
    if (isUserDataUpdate) {
      dispatch(loadUniverseDetails(log.universe, userAddress));
    }
  }
};
