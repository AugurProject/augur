import {
  DisputeCrowdsourcerCompletedLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerCreatedLog,
  DisputeCrowdsourcerRedeemedLog,
  DisputeWindowCreatedLog,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  MarketFinalizedLog,
  MarketInfo,
  NewBlock,
  OrderEventType,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  ProfitLossChangedLog,
  ReportingParticipantDisavowedLog,
  SubscriptionEventName,
  TokenBalanceChangedLog,
  TokensTransferredLog,
  TokenType,
  TradingProceedsClaimedLog,
  TXEventName,
  TXStatus,
  UniverseForkedLog,
  MarketOrderBook,
} from '@augurproject/sdk-lite';
import { logger } from '@augurproject/utils';
import { AppState } from 'appStore';
import * as _ from 'lodash';
import { updateAlert } from 'modules/alerts/actions/alerts';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { loadGasPriceInfo } from 'modules/app/actions/load-gas-price-info';
import {
  Ox_STATUS,
  updateAppStatus,
  WALLET_STATUS,
} from 'modules/app/actions/update-app-status';
import { updateBlockchain } from 'modules/app/actions/update-blockchain';
import { updateConnectionStatus } from 'modules/app/actions/update-connection';
import { checkAccountApproval } from 'modules/auth/actions/approve-account';
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { updateAssets } from 'modules/auth/actions/update-assets';
import {
  BUYPARTICIPATIONTOKENS,
  CLAIMMARKETSPROCEEDS,
  CLAIMTRADINGPROCEEDS,
  CONTRIBUTE,
  CREATE_MARKET,
  CREATEMARKET,
  DISAVOWCROWDSOURCERS,
  DOINITIALREPORT,
  DOINITIALREPORTWARPSYNC,
  MARKETMIGRATED,
  MIGRATE_FROM_LEG_REP_TOKEN,
  MODAL_ERROR,
  MODAL_GAS_PRICE,
  PUBLICFILLORDER,
  REDEEMSTAKE,
  SUBMIT_DISPUTE,
  SUBMIT_REPORT,
  TRANSFER,
  WALLET_STATUS_VALUES,
  ZEROX_STATUSES,
} from 'modules/common/constants';
import { getCategoryStats } from 'modules/create-market/actions/get-category-stats';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import {
  removeMarket,
  updateMarketsData,
} from 'modules/markets/actions/update-markets-data';
import { updateModal } from 'modules/modal/actions/update-modal';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { loadMarketOrderBook, updateMarketInvalidBids } from 'modules/orders/actions/load-market-orderbook';
import {
  constructPendingOrderid,
  removePendingOrder,
} from 'modules/orders/actions/pending-orders-management';
import {
  addPendingData,
  findAndSetTransactionsTimeouts,
  removePendingData,
  removePendingDataByHash,
  removePendingTransaction,
} from 'modules/pending-queue/actions/pending-queue-management';
import {
  checkUpdateUserPositions,
  loadAccountOnChainFrozenFundsTotals,
  loadAllAccountPositions,
} from 'modules/positions/actions/load-account-positions';
import {
  reloadDisputingPage,
  reloadReportingPage,
} from 'modules/reporting/actions/update-reporting-list';
import { isCurrentMarket } from 'modules/trades/helpers/is-current-market';
import {
  isOnDisputingPage,
  isOnReportingPage,
  isOnTradePage,
} from 'modules/trades/helpers/is-on-page';
import { MarketInfos } from 'modules/types';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';
import { updateUniverse } from 'modules/universe/actions/update-universe';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { marketCreationCreated, orderFilled } from 'services/analytics/helpers';
import { augurSdk } from 'services/augursdk';
import { isSameAddress } from 'utils/isSameAddress';
import { wrapLogHandler } from './wrap-log-handler';
import { getTradePageMarketId } from 'modules/trades/helpers/get-trade-page-market-id';

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
const HIGH_PRI_REFRESH_MS = 1000;
const MED_PRI_LOAD_REFRESH_MS = 2000;
const loadOrderBook = _.throttle(
  (dispatch, marketId) => dispatch(loadMarketOrderBook(marketId)),
  HIGH_PRI_REFRESH_MS,
  { loading: true }
);
const loadUserOpenOrders = _.throttle(
  dispatch => dispatch(loadAccountOpenOrders()),
  MED_PRI_LOAD_REFRESH_MS,
  { loading: true }
);
const throttleLoadMarketOrders = marketId => dispatch =>
  loadOrderBook(dispatch, marketId);
const throttleLoadUserOpenOrders = () => dispatch =>
  loadUserOpenOrders(dispatch);
const BLOCKS_BEHIND_RELOAD_THRESHOLD = 60; // 60 blocks.
let blocksBehindTimer = null;

const updateMarketOrderBook = (marketId: string) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (isCurrentMarket(marketId)) {
    dispatch(throttleLoadMarketOrders(marketId));
  }
};

export const handleTxAwaitingSigning = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('AwaitingSigning Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxPending = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxPending Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxSuccess = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxSuccess Transaction', txStatus.transaction.name);
  // update wallet status on any TxSuccess
  if (txStatus.transaction.name !== TRANSFER.toLowerCase()) {
    dispatch(updateAppStatus(WALLET_STATUS, WALLET_STATUS_VALUES.CREATED));
  }
  dispatch(updateAssets());
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFailure = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFailure Transaction', txStatus.transaction.name, txStatus);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxRelayerDown = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxRelayerDown Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
};

export const handleTxFeeTooLow = (txStatus: TXStatus) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('TxFeeTooLow Transaction', txStatus.transaction.name);
  dispatch(addUpdateTransaction(txStatus));
  dispatch(updateModal({ type: MODAL_GAS_PRICE, feeTooLow: true }));
};

export const handleZeroStatusUpdated = (status, log = undefined) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { env } = getState();
  if (log && log.error && log.error.message.includes('too many blocks')) {
    console.error('too many blocks behind, reloading UI');
    env.ui?.showReloadModal
      ? dispatch(
          updateModal({
            type: MODAL_ERROR,
            error: '(Orders) Too many blocks behind, please refresh',
            title: 'Currently Far Behind to get Orders',
          })
        )
      : location.reload();
  }
  dispatch(updateAppStatus(Ox_STATUS, status));
  if (status === ZEROX_STATUSES.SYNCED && getState().authStatus.isLogged) {
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
  dispatch(updateConnectionStatus(true));
  dispatch(loadAccountData());
  dispatch(loadUniverseForkingInfo());
  dispatch(getCategoryStats());

  // custom market doesn't update after hotloading
  // force update.
  const marketId = getTradePageMarketId();
  if (marketId) {
    dispatch(loadMarketsInfo([marketId]));
  }
};

export const handleNewBlockLog = (log: NewBlock) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain, env, universe, loginAccount } = getState();
  const blockTime = env.averageBlocktime;
  if (blocksBehindTimer) clearTimeout(blocksBehindTimer);
  blocksBehindTimer = setTimeout(function() {
    env.ui?.showReloadModal
      ? dispatch(
          updateModal({
            type: MODAL_ERROR,
            error: '(Syncing) Too many blocks behind, please refresh',
            title: 'Currently Far Behind in Syncing',
          })
        )
      : location.reload();
  }, BLOCKS_BEHIND_RELOAD_THRESHOLD * blockTime);
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
    dispatch(
      loadAnalytics(getState().analytics, blockchain.currentAugurTimestamp)
    );
    dispatch(findAndSetTransactionsTimeouts(log.highestAvailableBlockNumber));
  }
  // update ETH/REP rate and gasPrice each block
  dispatch(loadGasPriceInfo());
  if (log.logs && log.logs.length > 0) {
    console.log(log.logs);
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
  marketsInfo: MarketInfo[] | MarketInfo;
}) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState?: () => AppState
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
    const market = marketsInfo as MarketInfo;
    if (Object.keys(market).length === 0) return;
    marketsDataById[market.id] = market;
  }
  const marketIds = Object.keys(marketsDataById);
  dispatch(updateMarketsData(marketsDataById));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage(marketIds));
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};

export const handleMarketCreatedLog = (logs: any) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const userLogs = logs.filter(log =>
    isSameAddress(log.marketCreator, getState().loginAccount.address)
  );
  userLogs.map(log => {
    if (log.removed) {
      dispatch(removeMarket(log.market));
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
      dispatch(getCategoryStats());
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
  const universeId = getState().universe.id;
  const userAddress = getState().loginAccount.address;
  if (log.originalUniverse === universeId) {
    dispatch(removeMarket(log.market));
    dispatch(
      addPendingData(
        log.market,
        MARKETMIGRATED,
        TXEventName.Success,
        '0',
        undefined
      )
    );
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  dispatch(loadUniverseDetails(universeId, userAddress));
};

export const handleWarpSyncHashUpdatedLog = (log: { hash: string }) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log.hash) {
    dispatch(updateUniverse({ warpSyncHash: log.hash }));
  }
};

export const handleTokensTransferredLog = (logs: TokensTransferredLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { address } = getState().loginAccount;
  logs
    .filter(log => isSameAddress(log.from, address))
    .map(log => {
      // TODO: will need to update user's contribution to dispute/reporting
      // dispatch(loadReportingWindowBounds());
    });
};

export const handleTokenBalanceChangedLog = (
  logs: TokenBalanceChangedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { address } = getState().loginAccount;
  logs
    .filter(log => isSameAddress(log.owner, address))
    .map(log => {
      const isUserDataUpdate = isSameAddress(log.owner, address);
      if (isUserDataUpdate) {
        // dispatch(loadReportingWindowBounds());
      }
    });
};

export const handleBulkOrdersLog = (data: { logs: ParsedOrderEventLog[] }) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  logger.info('Bulk Order Events', data?.logs?.length);
  const { appStatus } = getState();
  const { zeroXStatus } = appStatus;
  const marketIds = [];
  if (zeroXStatus === ZEROX_STATUSES.SYNCED && data?.logs?.length > 0) {
    data.logs.map(log => {
      dispatch(handleOrderLog(log));
      marketIds.push(log.market);
    });
    const unqMarketIds = Array.from(new Set([...marketIds]));
    unqMarketIds.map(marketId => {
      if (isCurrentMarket(marketId)) {
        dispatch(updateMarketOrderBook(marketId));
        dispatch(loadMarketTradingHistory(marketId));
      }
    });
    dispatch(checkUpdateUserPositions(unqMarketIds));
  }
};

export const handleMarketInvalidBidsLog = ({ data }: MarketOrderBook) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (data && data.length > 0) {
    data.map(book => {
      const { marketId, orderBook } = book;
      if (!isCurrentMarket(marketId)) {
        dispatch(updateMarketInvalidBids(marketId, orderBook));
      }
    });
  }
};

export const handleLiquidityPoolUpdatedLog = (data: Logs.LiquidityPoolUpdated) => {
  console.log(data);
}

export const handleOrderLog = (log: any) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
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

export const handleOrderCreatedLog = (log: ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    loginAccount.mixedCaseAddress
  );
  if (isUserDataUpdate && authStatus.isLogged) {
    dispatch(throttleLoadUserOpenOrders());
    const pendingOrderId = constructPendingOrderid(
      log.price,
      log.outcome,
      log.market,
      log.orderType
    );
    dispatch(removePendingOrder(pendingOrderId, log.market));
  }
};

const handleOrderCanceledLogs = logs => (
  dispatch: ThunkDispatch<void, any, Action>
) => logs.map(log => dispatch(handleOrderCanceledLog(log)));

export const handleOrderCanceledLog = (log: ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const isUserDataUpdate = isSameAddress(
    log.orderCreator,
    loginAccount.mixedCaseAddress
  );
  const isUserDataAccount = isSameAddress(
    log.account,
    loginAccount.mixedCaseAddress
  );

  if (isUserDataUpdate || isUserDataAccount) {
    if (authStatus.isLogged) {
      dispatch(throttleLoadUserOpenOrders());
    }
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
      dispatch(updateMarketOrderBook(marketId));
      dispatch(loadMarketTradingHistory(marketId));
    }
  });
  dispatch(checkUpdateUserPositions(unqMarketIds));
};

export const handleOrderFilledLog = (log: ParsedOrderEventLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, authStatus } = getState();
  const { isLogged } = authStatus;
  const marketId = log.market;
  const { address } = loginAccount;
  const isUserDataUpdate =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isUserDataUpdate && isLogged) {
    dispatch(
      orderFilled(marketId, log, isSameAddress(log.orderCreator, address))
    );
    dispatch(throttleLoadUserOpenOrders());
    if (log.orderFiller) {
      handleAlert(log, PUBLICFILLORDER, true, dispatch, getState);
    }
    if (log.tradeGroupId) {
      dispatch(removePendingOrder(log.tradeGroupId, marketId));
    } else {
      const makePendingOrderId = constructPendingOrderid(
        log.price,
        log.outcome,
        log.market,
        log.orderType
      );
      const takePendingOrderId = constructPendingOrderid(
        log.price,
        log.outcome,
        log.market,
        log.orderType === "0x00" ? "0x01" : "0x00"
      );
      dispatch(removePendingOrder(makePendingOrderId, marketId));
      dispatch(removePendingOrder(takePendingOrderId, marketId));
    }
  }
};

export const handleTradingProceedsClaimedLog = (
  log: TradingProceedsClaimedLog
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const isUserDataUpdate = isSameAddress(
    log.sender,
    getState().loginAccount.address
  );
  if (isUserDataUpdate) {
    const { blockchain } = getState();
    dispatch(
      updateAlert(log.market, {
        name: CLAIMTRADINGPROCEEDS,
        timestamp: blockchain.currentAugurTimestamp * 1000,
        status: TXEventName.Success,
        params: { ...log },
      })
    );
    dispatch(removePendingTransaction(CLAIMMARKETSPROCEEDS));
  }
};

// ---- initial reporting ----- //
export const handleInitialReportSubmittedLog = (
  logs: InitialReportSubmittedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address;
  const userLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (userLogs.length > 0) {
    userLogs.map(log => {
      handleAlert(log, DOINITIALREPORT, false, dispatch, getState);
      dispatch(removePendingData(log.market, SUBMIT_REPORT));
    });
    dispatch(loadAccountReportingHistory());
  }
  const marketIds = userLogs.map(log => log.market);
  if (isOnReportingPage()) dispatch(reloadReportingPage(marketIds));
};

export const handleInitialReporterRedeemedLog = (
  logs: InitialReporterRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address;
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
  const address = getState().loginAccount.address;
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

export const handleProfitLossChangedLog = (logs: ProfitLossChangedLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const address = getState().loginAccount.address;
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0)
    dispatch(loadAllAccountPositions());
};

export const handleParticipationTokensRedeemedLog = (
  logs: ParticipationTokensRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address;
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
  logs: ReportingParticipantDisavowedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const address = getState().loginAccount.address;
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

export const handleUniverseForkedLog = (log: UniverseForkedLog) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  console.log('handleUniverseForkedLog');
  const { forkingMarket } = log;
  dispatch(loadUniverseForkingInfo(forkingMarket));
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleMarketFinalizedLog = (logs: MarketFinalizedLog[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  logs.map(log => {
    if (universe.forkingInfo) {
      if (log.market === universe.forkingInfo.forkingMarket) {
        dispatch(loadUniverseForkingInfo());
      }
    }
  });
  const marketIds = logs.map(m => m.market);
  dispatch(checkUpdateUserPositions(marketIds));
};

// ---- disputing ----- //
export const handleDisputeCrowdsourcerCreatedLog = (
  logs: DisputeCrowdsourcerCreatedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerCompletedLog = (
  logs: DisputeCrowdsourcerCompletedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
};

export const handleDisputeCrowdsourcerContributionLog = (
  logs: DisputeCrowdsourcerContributionLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const userLogs = logs.filter(log =>
    isSameAddress(log.reporter, getState().loginAccount.address)
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
  logs: DisputeCrowdsourcerRedeemedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const userLogs = logs.filter(log =>
    isSameAddress(log.reporter, getState().loginAccount.address)
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
  logs: DisputeWindowCreatedLog[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  if (logs.length > 0) {
    dispatch(loadDisputeWindow());
    dispatch(loadAccountReportingHistory());
    if (isOnDisputingPage()) dispatch(reloadDisputingPage([]));
  }
};

export const handleTokensMintedLog = (logs: TokensMinted[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const userAddress = getState().loginAccount.address;
  const isForking = !!getState().universe.forkingInfo;
  const universeId = getState().universe.id;
  let isParticipationTokens = !!logs.find(
    l => l.tokenType === TokenType.ParticipationToken
  );
  logs
    .filter(log => isSameAddress(log.target, userAddress))
    .map(log => {
      if (log.tokenType === TokenType.ParticipationToken) {
        dispatch(removePendingTransaction(BUYPARTICIPATIONTOKENS));
        dispatch(loadAccountReportingHistory());
      }
      if (log.tokenType === TokenType.ReputationToken && isForking) {
        dispatch(loadUniverseDetails(universeId, userAddress));
      }
      if (log.tokenType === TokenType.ReputationToken && !isForking) {
        dispatch(
          updateAlert(
            log.blockHash,
            {
              id: log.blockHash,
              uniqueId: log.blockHash,
              params: { ...log },
              status: TXEventName.Success,
              timestamp: getState().blockchain.currentAugurTimestamp * 1000,
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
  [SubscriptionEventName.OrderEvent]: wrapLogHandler(
    handleNewBlockFilledOrdersLog
  ),
  [SubscriptionEventName.CancelZeroXOrder]: wrapLogHandler(
    handleOrderCanceledLogs
  ),
  [SubscriptionEventName.TokensTransferred]: wrapLogHandler(
    handleTokensTransferredLog
  ),
  [SubscriptionEventName.TokenBalanceChanged]: wrapLogHandler(
    handleTokenBalanceChangedLog
  ),
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
  "error": () => {
    console.error("ERROR: ", error);
  }
};
