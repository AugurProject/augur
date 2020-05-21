import { Getters, SubscriptionEventName } from '@augurproject/sdk';
import { updateAlert } from 'modules/alerts/actions/alerts';
import {
  loadAllAccountPositions,
  loadAccountOnChainFrozenFundsTotals,
  checkUpdateUserPositions,
} from 'modules/positions/actions/load-account-positions';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { MarketInfos } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { isSameAddress } from 'utils/isSameAddress';
import { Events, Logs, TXEventName, OrderEventType } from '@augurproject/sdk';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import {
  CANCELORDER,
  CLAIMTRADINGPROCEEDS,
  CONTRIBUTE,
  CREATEMARKET,
  DOINITIALREPORT,
  PUBLICFILLORDER,
  PUBLICTRADE,
  REDEEMSTAKE,
  CREATE_MARKET,
  MODAL_GAS_PRICE,
  SUBMIT_REPORT,
  MIGRATE_FROM_LEG_REP_TOKEN,
  BUYPARTICIPATIONTOKENS,
  SUBMIT_DISPUTE,
  CLAIMMARKETSPROCEEDS,
  DISAVOWCROWDSOURCERS,
  MARKETMIGRATED,
  DOINITIALREPORTWARPSYNC,
  ZEROX_STATUSES,
  MODAL_ERROR,
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
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { marketCreationCreated, orderFilled } from 'services/analytics/helpers';
import * as _ from 'lodash';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import {
  removePendingDataByHash,
  addPendingData,
  removePendingData,
  removePendingTransaction,
  findAndSetTransactionsTimeouts,
} from 'modules/pending-queue/actions/pending-queue-management';
import {
  removePendingOrder,
  constructPendingOrderid,
} from 'modules/orders/actions/pending-orders-management';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { wrapLogHandler } from './wrap-log-handler';
import { getEthToDaiRate } from 'modules/app/actions/get-ethToDai-rate';
import { WALLET_STATUS_VALUES } from 'modules/common/constants';
import { getRepToDaiRate } from 'modules/app/actions/get-repToDai-rate';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';
import { logger } from '@augurproject/utils';
import { PendingOrders } from 'modules/app/store/pending-orders';

const handleAlert = (
  log: any,
  name: string,
  toast: boolean,
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const timestamp = currentAugurTimestamp * 1000;
  try {
    dispatch(
      updateAlert(log.transactionHash, {
        params: log,
        toast: toast,
        status: TXEventName.Success,
        timestamp,
        name,
      })
    );
  } catch (e) {
    console.error('alert could not be created', e);
  }
};
const HIGH_PRI_REFRESH_MS = 1000;
const MED_PRI_LOAD_REFRESH_MS = 2000;
const loadOrderBook = _.throttle(
  (marketId) => Markets.actions.updateOrderBook(marketId, null, loadMarketOrderBook(marketId)),
  HIGH_PRI_REFRESH_MS,
  { leading: true }
);
const loadUserOpenOrders = _.throttle(
  dispatch => dispatch(loadAccountOpenOrders()),
  MED_PRI_LOAD_REFRESH_MS,
  { leading: true }
);
const throttleLoadMarketOrders = marketId => loadOrderBook(marketId);
const throttleLoadUserOpenOrders = () => dispatch =>
  loadUserOpenOrders(dispatch);
const BLOCKS_BEHIND_RELOAD_THRESHOLD = 60; // 60 blocks.
let blocksBehindTimer = null;

const updateMarketOrderBook = (marketId: string) => {
  if (isCurrentMarket(marketId)) {
    throttleLoadMarketOrders(marketId);
  }
};

export const handleTxAwaitingSigning = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('AwaitingSigning Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxPending = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxPending Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxSuccess = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxSuccess Transaction', txStatus.transaction.name);
  // update wallet status on any TxSuccess
  AppStatus.actions.setWalletStatus(WALLET_STATUS_VALUES.CREATED);
  dispatch(updateAssets());
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFailure = (txStatus: Events.TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFailure Transaction', txStatus.transaction.name, txStatus);
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
  AppStatus.actions.setModal({ type: MODAL_GAS_PRICE, feeTooLow: true });
};

export const handleZeroStatusUpdated = (status, log = undefined) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { isLogged, env: { showReloadModal } } = AppStatus.get();  
  if (log && log.error && log.error.message.includes('too many blocks')) {
    console.error('too many blocks behind, reloading UI');
    showReloadModal ? AppStatus.actions.setModal({
      type: MODAL_ERROR,
      error: '(Orders) Too many blocks behind, please refresh',
      title: 'Currently Far Behind to get Orders',
    }) : location.reload();
  }
  const { isLogged, zeroXStatus } = AppStatus.get();
  if (zeroXStatus !== status) AppStatus.actions.setOxStatus(status);
  if (status === ZEROX_STATUSES.SYNCED && isLogged) {
    dispatch(throttleLoadUserOpenOrders());
  }
};

export const handleSDKReadyEvent = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  // wire up events for sdk
  augurSdk.subscribe(dispatch);

  // app is connected when subscribed to sdk
  AppStatus.actions.setIsConnected(true);
  dispatch(loadAccountData());
  dispatch(loadUniverseForkingInfo());
  dispatch(getCategoryStats());
};

export const handleNewBlockLog = (log: Events.NewBlock) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    analytics,
    env: { averageBlocktime, showReloadModal },
    isLogged,
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const blockTime = averageBlocktime;
  if (blocksBehindTimer) clearTimeout(blocksBehindTimer);
  blocksBehindTimer = setTimeout(function() {
    showReloadModal ?
    AppStatus.actions.setModal({
      type: MODAL_ERROR,
      error: '(Synching) Too many blocks behind, please refresh',
      title: 'Currently Far Behind in Syncing',
    })
    : location.reload();
  }, BLOCKS_BEHIND_RELOAD_THRESHOLD * blockTime);
  AppStatus.actions.updateBlockchain({
    currentBlockNumber: log.highestAvailableBlockNumber,
    blocksBehindCurrent: log.blocksBehindCurrent,
    lastSyncedBlockNumber: log.lastSyncedBlockNumber,
    percentSynced: log.percentSynced,
    currentAugurTimestamp: log.timestamp,
  });
  // update assets each block
  if (isLogged) {
    dispatch(updateAssets());
    dispatch(checkAccountAllowance());
    loadAnalytics(analytics, currentAugurTimestamp);
    dispatch(findAndSetTransactionsTimeouts(log.highestAvailableBlockNumber));
  }
  // update ETH/REP rate and gasPrice each block
  dispatch(getEthToDaiRate());
  dispatch(getRepToDaiRate());

  if (log.logs && log.logs.length > 0) {
    const eventLogs = log.logs.reduce(
      (p, l) => ({ ...p, [l.name]: p[l.name] ? [...p[l.name], l] : [l] }),
      {}
    );
    Object.keys(eventLogs).map(event => {
      if (EventHandlers[event])
        dispatch(EventHandlers[event](eventLogs[event]));
    });
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
  const marketIds = Object.keys(marketsDataById);
  Markets.actions.updateMarketsData(marketsDataById);

  if (isOnDisputingPage()) dispatch(reloadDisputingPage(marketIds));
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};

export const handleMarketCreatedLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  const userLogs = logs.filter(log =>
    isSameAddress(log.marketCreator, address)
  );
  userLogs.map(log => {
    if (log.removed) {
      Markets.actions.removeMarket(log.markett);
    } else {
      dispatch(
        loadMarketsInfo([log.market], (err, marketInfos) => {
          if (err) return console.error(err);
          Object.keys(marketInfos).map(id => {
            const market = marketInfos[id];
            if (market) {
              dispatch(
                removePendingDataByHash(market.transactionHash, CREATE_MARKET)
              );
              handleAlert(log, CREATEMARKET, false, dispatch, getState);
              dispatch(marketCreationCreated(market, log.extraInfo));
            }
          });
        })
      );
    }
  });
  if (userLogs.length > 0) {
    dispatch(loadAccountOnChainFrozenFundsTotals());
  }
};

export const handleReportingStateChanged = (event: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (event.data) {
    const marketIds = _.map(event.data, 'market');
    if (isOnDisputingPage()) dispatch(reloadDisputingPage(marketIds));
    if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
    dispatch(checkUpdateUserPositions(marketIds));
  }
};

export const handleMarketMigratedLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    loginAccount: { address },
    universe: { id: universeId },
  } = AppStatus.get();
  if (log.originalUniverse === universeId) {
    Markets.actions.removeMarket(log.markett);
    dispatch(addPendingData(log.market, MARKETMIGRATED, TXEventName.Success, '0', undefined));
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  dispatch(loadUniverseDetails(universeId, address));
};

export const handleWarpSyncHashUpdatedLog = (log: { hash: string }) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log.hash) {
    AppStatus.actions.updateUniverse({ warpSyncHash: log.hash });
  }
};

export const handleTokensTransferredLog = (
  logs: Logs.TokensTransferredLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  logs
    .filter(log => isSameAddress(log.from, address))
    .map(log => {
      // TODO: will need to update user's contribution to dispute/reporting
      // dispatch(loadReportingWindowBounds());
    });
};

export const handleTokenBalanceChangedLog = (
  logs: Logs.TokenBalanceChangedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  logs
    .filter(log => isSameAddress(log.owner, address))
    .map(log => {
      const isUserDataUpdate = isSameAddress(log.owner, address);
      if (isUserDataUpdate) {
        // dispatch(loadReportingWindowBounds());
      }
    });
};

export const handleBulkOrdersLog = (data: {
  logs: Logs.ParsedOrderEventLog[];
}) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  logger.info('Bulk Order Events', data?.logs?.length);
  const { zeroXStatus } = AppStatus.get();
  const marketIds = [];
  if (zeroXStatus === ZEROX_STATUSES.SYNCED && data?.logs?.length > 0) {
    data.logs.map(log => {
      dispatch(handleOrderLog(log));
      marketIds.push(log.market);
    });
    const unqMarketIds = Array.from(new Set([...marketIds]));
    unqMarketIds.map(marketId => {
      if (isCurrentMarket(marketId)) {
        updateMarketOrderBook(marketId);
        Markets.actions.bulkMarketTradingHistory(null, loadMarketTradingHistory(marketId));
        dispatch(checkUpdateUserPositions([marketId]));
      }
    });
    dispatch(checkUpdateUserPositions(unqMarketIds));
  }
};

export const handleOrderLog = (log: any) =>
(dispatch: ThunkDispatch<void, any, Action>) => {
  const type = log.eventType;
  switch (type) {
    case OrderEventType.Create:
      return dispatch(handleOrderCreatedLog(log));
    case OrderEventType.Expire:
    case OrderEventType.Cancel:
      return dispatch(handleOrderCanceledLog(log));
    case OrderEventType.Fill:
      return dispatch(handleOrderFilledLog(log));
    default:
      console.log(`Unknown order event type "${log.eventType}" for log`, log);
  }

  return null;
};

export const handleOrderCreatedLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    loginAccount: { mixedCaseAddress },
  } = AppStatus.get();
  const isUserDataUpdate = isSameAddress(log.orderCreator, mixedCaseAddress);
  if (isUserDataUpdate && AppStatus.get().isLogged) {
    handleAlert(log, PUBLICTRADE, false, dispatch, getState);
    dispatch(throttleLoadUserOpenOrders());
    const pendingOrderId = constructPendingOrderid(
      log.amount,
      log.price,
      log.outcome,
      log.market
    );
    const { pendingOrders } = PendingOrders.get();
    const marketPendingOrders = pendingOrders[log.market];
    if (marketPendingOrders?.find(pending => pending.id === pendingOrderId)) {
      dispatch(removePendingOrder(pendingOrderId, log.market));
    }
  }
};

const handleOrderCanceledLogs = logs => (
  dispatch: ThunkDispatch<void, any, Action>
) => logs.map(log => dispatch(handleOrderCanceledLog(log)));


export const handleOrderCanceledLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    loginAccount: { mixedCaseAddress },
    isLogged,
  } = AppStatus.get();
  const isUserDataUpdate = isSameAddress(log.orderCreator, mixedCaseAddress);
  const isUserDataAccount = isSameAddress(
    log.account,
    mixedCaseAddress
  );
  if (isLogged && (isUserDataUpdate || isUserDataAccount)) {
    dispatch(throttleLoadUserOpenOrders());
  }
};

const handleNewBlockFilledOrdersLog = logs => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  logs
    .filter(l => l.eventType === OrderEventType.Fill)
    .map(l => dispatch(handleOrderFilledLog(l)));
  const unqMarketIds: string[] = Array.from(new Set(logs.map(l => l.market)));
  unqMarketIds.map((marketId: string) => {
    if (isCurrentMarket(marketId)) {
      updateMarketOrderBook(marketId);
      Markets.actions.bulkMarketTradingHistory(null, loadMarketTradingHistory(marketId));
      dispatch(checkUpdateUserPositions([marketId]));
    }
  });
  dispatch(checkUpdateUserPositions(unqMarketIds));
};

export const handleOrderFilledLog = (log: Logs.ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    isLogged,
    loginAccount: { address },
  } = AppStatus.get();
  const marketId = log.market;
  const isUserDataUpdate =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isUserDataUpdate && isLogged) {
    dispatch(
      orderFilled(marketId, log, isSameAddress(log.orderCreator, address))
    );
    dispatch(throttleLoadUserOpenOrders());
    if (log.orderFiller)
      handleAlert(log, PUBLICFILLORDER, true, dispatch, getState);
    dispatch(removePendingOrder(log.tradeGroupId, marketId));
  }
};

export const handleTradingProceedsClaimedLog = (
  log: Logs.TradingProceedsClaimedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const {
    loginAccount: { address },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  if (isSameAddress(
    log.sender,
    address
  )) {
    dispatch(
      updateAlert(log.market, {
        name: CLAIMTRADINGPROCEEDS,
        timestamp: currentAugurTimestamp * 1000,
        status: TXEventName.Success,
        params: { ...log },
      })
    );
    dispatch(removePendingTransaction(CLAIMMARKETSPROCEEDS));
  }
};

// ---- initial reporting ----- //
export const handleInitialReportSubmittedLog = (
  logs: Logs.InitialReportSubmittedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address }} = AppStatus.get();
  const userLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (userLogs.length > 0) {
    userLogs.map(log => {
      handleAlert(log, DOINITIALREPORT, false, dispatch, getState)
      dispatch(removePendingData(log.market, SUBMIT_REPORT));
    });
    dispatch(loadAccountReportingHistory());
  }
  const marketIds = userLogs.map(log => log.market);
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};

export const handleInitialReporterRedeemedLog = (
  logs: Logs.InitialReporterRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address }} = AppStatus.get();
  const reporterLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (reporterLogs.length > 0) {
    dispatch(loadAccountReportingHistory());
    dispatch(removePendingTransaction(REDEEMSTAKE));
    reporterLogs.map(log => {
      handleAlert(log, REDEEMSTAKE, false, dispatch, getState);
    });
  }
};

export const handleInitialReporterTransferredLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount: { address }} = AppStatus.get();
  const userLogs = logs.filter(
    log => isSameAddress(log.from, address) || isSameAddress(log.to, address)
  );
  if (userLogs.length > 0) {
    dispatch(loadAccountReportingHistory());
    userLogs.map(log => {
      handleAlert(log, DOINITIALREPORTWARPSYNC, false, dispatch, getState);
    });
  }
  const marketIds = userLogs.map(log => log.market);
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};
// ---- ------------ ----- //

export const handleProfitLossChangedLog = (
  logs: Logs.ProfitLossChangedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address }} = AppStatus.get();
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0)
    dispatch(loadAllAccountPositions());
};

export const handleParticipationTokensRedeemedLog = (
  logs: Logs.ParticipationTokensRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address }} = AppStatus.get();
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0) {
    logs.map(log =>
      handleAlert(
        { ...log, marketId: 1 },
        REDEEMSTAKE,
        false,
        dispatch,
        getState
      )
    );
    dispatch(loadAccountReportingHistory());
    dispatch(removePendingTransaction(REDEEMSTAKE));
  }
};

export const handleReportingParticipantDisavowedLog = (
  logs: Logs.ReportingParticipantDisavowedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address }} = AppStatus.get();
  if (
    logs.filter(log => isSameAddress(log.reportingParticipant, address))
      .length > 0
  ) {
    dispatch(loadAccountReportingHistory());
  }
};

export const handleMarketParticipantsDisavowedLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketIds = logs.map(log => log.market);
  marketIds.map(marketId => {
    dispatch(
      addPendingData(marketId, DISAVOWCROWDSOURCERS, TXEventName.Success, '0')
    );
  });
  dispatch(loadMarketsInfo(marketIds));
};

export const handleMarketTransferredLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const marketIds = logs.map(log => log.market);
  dispatch(loadMarketsInfo(marketIds));
};

export const handleUniverseForkedLog = (log: Logs.UniverseForkedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleUniverseForkedLog');
  const { forkingMarket } = log;
  dispatch(loadUniverseForkingInfo(forkingMarket));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleMarketFinalizedLog = (logs: Logs.MarketFinalizedLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    universe: { forkingInfo },
  } = AppStatus.get();
  logs.map(log => {
    if (forkingInfo) {
      if (log.market === forkingInfo.forkingMarket) {
        dispatch(loadUniverseForkingInfo());
      }
    }
  });
  const marketIds = logs.map(m => m.market);
  dispatch(checkUpdateUserPositions(marketIds));
};

// ---- disputing ----- //
export const handleDisputeCrowdsourcerCreatedLog = (
  logs: Logs.DisputeCrowdsourcerCreatedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerCompletedLog = (
  logs: Logs.DisputeCrowdsourcerCompletedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerContributionLog = (
  logs: Logs.DisputeCrowdsourcerContributionLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address } } = AppStatus.get();
  const userLogs = logs.filter(log =>
    isSameAddress(log.reporter, address)
  );
  if (userLogs.length > 0) {
    logs.map(log => {
      handleAlert(log, CONTRIBUTE, false, dispatch, getState);
      dispatch(removePendingData(log.market, SUBMIT_DISPUTE));
    });
    dispatch(loadAccountReportingHistory());
  }
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerRedeemedLog = (
  logs: Logs.DisputeCrowdsourcerRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount: { address } } = AppStatus.get();
  const userLogs = logs.filter(log =>
    isSameAddress(log.reporter, address)
  );
  if (userLogs.length > 0) {
    dispatch(loadAccountReportingHistory());
    userLogs.map(log =>
      handleAlert(log, REDEEMSTAKE, false, dispatch, getState)
    );
  }
  dispatch(removePendingTransaction(REDEEMSTAKE));
};
// ---- ------------ ----- //

export const handleDisputeWindowCreatedLog = (
  logs: Logs.DisputeWindowCreatedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (logs.length > 0) {
    dispatch(loadDisputeWindow());
    dispatch(loadAccountReportingHistory());
    if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
  }
};

export const handleTokensMintedLog = (logs: Logs.TokensMinted[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const {
    loginAccount: { address: userAddress },
    universe: { id: universeId, forkingInfo },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const isForking = !!forkingInfo;
  let isParticipationTokens = !!logs.find(
    l => l.tokenType === Logs.TokenType.ParticipationToken
  );
  logs
    .filter(log => isSameAddress(log.target, userAddress))
    .map(log => {
      if (log.tokenType === Logs.TokenType.ParticipationToken) {
        dispatch(removePendingTransaction(BUYPARTICIPATIONTOKENS));
        dispatch(loadAccountReportingHistory());
      }
      if (log.tokenType === Logs.TokenType.ReputationToken && isForking) {
        dispatch(loadUniverseDetails(universeId, userAddress));
      }
      if (log.tokenType === Logs.TokenType.ReputationToken && !isForking) {
        const timestamp = currentAugurTimestamp * 1000;
        dispatch(
          updateAlert(
            log.blockHash,
            {
              id: log.blockHash,
              uniqueId: log.blockHash,
              params: { ...log },
              status: TXEventName.Success,
              timestamp,
              name: MIGRATE_FROM_LEG_REP_TOKEN,
              toast: true,
            },
            false
          )
        );
        dispatch(removePendingTransaction(MIGRATE_FROM_LEG_REP_TOKEN));
      }
    });
  if (isParticipationTokens) dispatch(loadDisputeWindow());
};

const EventHandlers = {
  [SubscriptionEventName.OrderEvent]: wrapLogHandler(handleNewBlockFilledOrdersLog),
  [SubscriptionEventName.CancelZeroXOrder]: wrapLogHandler(handleOrderCanceledLogs),
  [SubscriptionEventName.TokensTransferred]: wrapLogHandler(handleTokensTransferredLog),
  [SubscriptionEventName.TokenBalanceChanged]: wrapLogHandler(handleTokenBalanceChangedLog),
  [SubscriptionEventName.TokensMinted]: wrapLogHandler(handleTokensMintedLog),
  [SubscriptionEventName.ProfitLossChanged]: wrapLogHandler(
    handleProfitLossChangedLog
  ),
  [SubscriptionEventName.DisputeWindowCreated]: wrapLogHandler(
    handleDisputeWindowCreatedLog
  ),
  [SubscriptionEventName.MarketFinalized]: wrapLogHandler(
    handleMarketFinalizedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerContribution]: wrapLogHandler(
    handleDisputeCrowdsourcerContributionLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerCompleted]: wrapLogHandler(
    handleDisputeCrowdsourcerCompletedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerRedeemed]: wrapLogHandler(
    handleDisputeCrowdsourcerRedeemedLog
  ),
  [SubscriptionEventName.DisputeCrowdsourcerCreated]: wrapLogHandler(
    handleDisputeCrowdsourcerCreatedLog
  ),
  [SubscriptionEventName.ParticipationTokensRedeemed]: wrapLogHandler(
    handleParticipationTokensRedeemedLog
  ),
  [SubscriptionEventName.ReportingParticipantDisavowed]: wrapLogHandler(
    handleReportingParticipantDisavowedLog
  ),
  [SubscriptionEventName.MarketParticipantsDisavowed]: wrapLogHandler(
    handleMarketParticipantsDisavowedLog
  ),
  [SubscriptionEventName.MarketTransferred]: wrapLogHandler(
    handleMarketTransferredLog
  ),
  [SubscriptionEventName.InitialReporterTransferred]: wrapLogHandler(
    handleInitialReporterTransferredLog
  ),
  [SubscriptionEventName.InitialReporterRedeemed]: wrapLogHandler(
    handleInitialReporterRedeemedLog
  ),
  [SubscriptionEventName.InitialReportSubmitted]: wrapLogHandler(
    handleInitialReportSubmittedLog
  ),
  [SubscriptionEventName.MarketCreated]: wrapLogHandler(handleMarketCreatedLog),
};
