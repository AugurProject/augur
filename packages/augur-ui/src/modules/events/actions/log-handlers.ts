import { updateAlert } from 'modules/alerts/actions/alerts';
import { loadAnalytics } from 'modules/app/actions/analytics-management';
import { getEthToDaiRate } from 'modules/app/actions/get-ethToDai-rate';
import { getRepToDaiRate } from 'modules/app/actions/get-repToDai-rate';
import {
  loadAllAccountPositions,
  loadAccountOnChainFrozenFundsTotals,
  checkUpdateUserPositions,
} from 'modules/positions/actions/load-account-positions';
import { loadMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { isSameAddress } from 'utils/isSameAddress';
import { loadUniverseForkingInfo } from 'modules/universe/actions/load-forking-info';
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
  LiquidityPoolUpdated,
} from '@augurproject/sdk-lite';
import { logger } from '@augurproject/utils';
import { addUpdateTransaction } from 'modules/events/actions/add-update-transaction';
import { augurSdk } from 'services/augursdk';
import { checkAccountAllowance } from 'modules/auth/actions/approve-account';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import {
  BUYPARTICIPATIONTOKENS,
  CLAIMTRADINGPROCEEDS,
  CONTRIBUTE,
  CREATE_MARKET,
  CREATEMARKET,
  DISAVOWCROWDSOURCERS,
  DOINITIALREPORT,
  MARKETMIGRATED,
  MIGRATE_FROM_LEG_REP_TOKEN,
  MODAL_ERROR,
  MODAL_GAS_PRICE,
  PUBLICFILLORDER,
  REDEEMSTAKE,
  SUBMIT_DISPUTE,
  CLAIMMARKETSPROCEEDS,
  DISAVOWCROWDSOURCERS,
  DOINITIALREPORTWARPSYNC,
  ZEROX_STATUSES,
  MODAL_ERROR,
  PUBLICTRADE,
  WALLET_STATUS_VALUES,
  SUBMIT_REPORT,
  THEMES,
  REDEEMPARTICIPATIONTOKENS,
} from 'modules/common/constants';
import { getCategoryStats } from 'modules/create-market/actions/get-category-stats';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import {
  constructPendingOrderid,
  removePendingOrder,
} from 'modules/orders/actions/pending-orders-management';
import {
  reloadDisputingPage,
  reloadReportingPage,
} from 'modules/reporting/actions/update-reporting-list';
import {
  isOnDisputingPage,
  isOnReportingPage,
} from 'modules/trades/helpers/is-on-page';
import { MarketInfos } from 'modules/types';
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
import { loadAccountData } from 'modules/auth/actions/load-account-data';
import { wrapLogHandler } from './wrap-log-handler';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';
import { PendingOrders } from 'modules/app/store/pending-orders';
import { loadGasPriceInfo } from 'modules/app/actions/load-gas-price-info';
import { loadUniverseDetails } from 'modules/universe/actions/load-universe-details';

const handleAlert = (log: any, name: string, toast: boolean) => {
  const {
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const timestamp = currentAugurTimestamp * 1000;
  try {
    updateAlert(log.transactionHash, {
      params: log,
      toast: toast,
      status: TXEventName.Success,
      timestamp,
      name,
    });
  } catch (e) {
    console.error('alert could not be created', e);
  }
};
const HIGH_PRI_REFRESH_MS = 1000;
const MED_PRI_LOAD_REFRESH_MS = 2000;
const loadOrderBook = _.throttle(
  marketId =>
    Markets.actions.updateOrderBook(
      marketId,
      null,
      loadMarketOrderBook(marketId)
    ),
  HIGH_PRI_REFRESH_MS,
  { leading: true }
);
const loadUserOpenOrders = _.throttle(
  () => loadAccountOpenOrders(),
  MED_PRI_LOAD_REFRESH_MS,
  { leading: true }
);
const throttleLoadMarketOrders = marketId => loadOrderBook(marketId);
const throttleLoadUserOpenOrders = () => loadUserOpenOrders();
const BLOCKS_BEHIND_RELOAD_THRESHOLD = 60; // 60 blocks.
let blocksBehindTimer = null;

const updateMarketOrderBook = (marketId: string) => {
  if (isCurrentMarket(marketId)) {
    throttleLoadMarketOrders(marketId);
  }
};

export const handleTxEvents = (txStatus: Events.TXStatus) => {
  console.log(
    `${txStatus.eventName} for ${txStatus.transaction.name} Transaction.`
  );
  if (txStatus.eventName === 'Success') {
    AppStatus.actions.setWalletStatus(WALLET_STATUS_VALUES.CREATED);
    // for faucets we have to treat it like an inital login to pull latest info.
    updateAssets(txStatus?.transaction?.name === 'faucet');
  } else if (txStatus.eventName === 'FeeTooLow') {
    AppStatus.actions.setModal({ type: MODAL_GAS_PRICE, feeTooLow: true });
  }
  addUpdateTransaction(txStatus);
};

export const handleZeroStatusUpdated = (status, log = undefined) => {
  const {
    isLogged,
    zeroXStatus,
    env: { ui: { showReloadModal } },
  } = AppStatus.get();
  if (log && log.error && log.error.message.includes('too many blocks')) {
    console.error('too many blocks behind, reloading UI');
    showReloadModal
      ? AppStatus.actions.setModal({
          type: MODAL_ERROR,
          error: '(Orders) Too many blocks behind, please refresh',
          title: 'Currently Far Behind to get Orders',
        })
      : location.reload();
  }
  if (zeroXStatus !== status) AppStatus.actions.setOxStatus(status);
  if (status === ZEROX_STATUSES.SYNCED && isLogged) {
    throttleLoadUserOpenOrders();
  }
};

export const handleSDKReadyEvent = () => {
  // wire up events for sdk
  augurSdk.subscribe();

  // app is connected when subscribed to sdk
  AppStatus.actions.setIsConnected(true);
  loadAccountData();
  loadUniverseForkingInfo();
  getCategoryStats();
};

export const handleNewBlockLog = async (log: Events.NewBlock) => {
  const {
    analytics,
    env: { averageBlocktime, ui: { showReloadModal } },
    isLogged,
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const blockTime = averageBlocktime;
  if (blocksBehindTimer) clearTimeout(blocksBehindTimer);
  blocksBehindTimer = setTimeout(function() {
    showReloadModal
      ? AppStatus.actions.setModal({
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
    updateAssets();
    checkAccountAllowance();
    loadAnalytics(analytics, currentAugurTimestamp);
    findAndSetTransactionsTimeouts(log.highestAvailableBlockNumber);
  }
  // update ETH/REP rate and gasPrice each block
  getEthToDaiRate();
  getRepToDaiRate();
  loadGasPriceInfo();

  if (log.logs && log.logs.length > 0) {
    const eventLogs = log.logs.reduce(
      (p, l) => ({ ...p, [l.name]: p[l.name] ? [...p[l.name], l] : [l] }),
      {}
    );
    Object.keys(eventLogs).map(event => {
      if (EventHandlers[event])
        EventHandlers[event](eventLogs[event]);
    });
  }
};

export const handleMarketsUpdatedLog = ({
  marketsInfo = [],
}: {
  marketsInfo: MarketInfo[] | MarketInfo;
}) => {
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
  Markets.actions.updateMarketsData(marketsDataById);

  if (isOnDisputingPage()) reloadDisputingPage(marketIds);
  if (isOnReportingPage()) reloadReportingPage(marketIds);
};

export const handleMarketCreatedLog = (logs: any) => {
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
      Markets.actions.updateMarketsData(
        null,
        loadMarketsInfo([log.market], (err, marketInfos) => {
          if (err) return console.error(err);
          Object.keys(marketInfos).map(id => {
            const market = marketInfos[id];
            if (market) {
              removePendingDataByHash(market.transactionHash, CREATE_MARKET);
              handleAlert(log, CREATEMARKET, false);
              marketCreationCreated(market, log.extraInfo);
            }
          });
        })
      );
      getCategoryStats();
    }
  });
  if (userLogs.length > 0) {
    loadAccountOnChainFrozenFundsTotals();
  }
};

export const handleReportingStateChanged = (event: any) => {
  if (event.data) {
    const marketIds = _.map(event.data, 'market');
    if (isOnDisputingPage()) reloadDisputingPage(marketIds);
    if (isOnReportingPage()) reloadReportingPage(marketIds);
    checkUpdateUserPositions(marketIds);
  }
};

export const handleMarketMigratedLog = (log: any) => {
  const {
    loginAccount: { address },
    universe: { id: universeId },
  } = AppStatus.get();
  if (log.originalUniverse === universeId) {
    Markets.actions.removeMarket(log.markett);
    addPendingData(
      log.market,
      MARKETMIGRATED,
      TXEventName.Success,
      '0',
      undefined
    );
  } else {
    Markets.actions.updateMarketsData(null, loadMarketsInfo([log.market]));
  }
  loadUniverseDetails(universeId, address);
};

export const handleWarpSyncHashUpdatedLog = (log: { hash: string }) => {
  if (log.hash) {
    AppStatus.actions.updateUniverse({ warpSyncHash: log.hash });
  }
};

export const handleTokensTransferredLog = (
  logs: TokensTransferredLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  logs
    .filter(log => isSameAddress(log.from, address))
    .map(log => {
      // TODO: will need to update user's contribution to dispute/reporting
      // loadReportingWindowBounds();
    });
};

export const handleTokenBalanceChangedLog = (
  logs: TokenBalanceChangedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  logs
    .filter(log => isSameAddress(log.owner, address))
    .map(log => {
      const isUserDataUpdate = isSameAddress(log.owner, address);
      if (isUserDataUpdate) {
        // loadReportingWindowBounds();
      }
    });
};

export const handleBulkOrdersLog = (data: {
  logs: ParsedOrderEventLog[];
}) => {
  logger.info('Bulk Order Events', data?.logs?.length);
  const { zeroXStatus } = AppStatus.get();
  const marketIds = [];
  if (zeroXStatus === ZEROX_STATUSES.SYNCED && data?.logs?.length > 0) {
    data.logs.map(log => {
      handleOrderLog(log);
      marketIds.push(log.market);
    });
    const unqMarketIds = Array.from(new Set([...marketIds]));
    unqMarketIds.map(marketId => {
      if (isCurrentMarket(marketId)) {
        updateMarketOrderBook(marketId);
        Markets.actions.bulkMarketTradingHistory(
          null,
          loadMarketTradingHistory(marketId)
        );
        checkUpdateUserPositions([marketId]);
      }
    });
    checkUpdateUserPositions(unqMarketIds);
  }
};

export const handleLiquidityPoolUpdatedLog = (
  data: LiquidityPoolUpdated
) => {
  // console.log("HandleLiquidityPoolUpdatedLog:", data);
  delete data.eventName;
  Markets.actions.updateLiquidityPools(data);
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

export const handleOrderCreatedLog = (log: ParsedOrderEventLog) => {
  const {
    isLogged,
    loginAccount: { mixedCaseAddress },
  } = AppStatus.get();
  const isUserDataUpdate = isSameAddress(log.orderCreator, mixedCaseAddress);
  if (isUserDataUpdate && isLogged) {
    handleAlert(log, PUBLICTRADE, false);
    throttleLoadUserOpenOrders();
    const pendingOrderId = constructPendingOrderid(
      log.amount,
      log.price,
      log.outcome,
      log.market,
      log.orderType
    );
    const { pendingOrders } = PendingOrders.get();
    const marketPendingOrders = pendingOrders[log.market];
    if (marketPendingOrders?.find(pending => pending.id === pendingOrderId)) {
      removePendingOrder(pendingOrderId, log.market);
    }
  }
};

const handleOrderCanceledLogs = logs =>
  logs.map(log => handleOrderCanceledLog(log));

export const handleOrderCanceledLog = (log: ParsedOrderEventLog) => {
  const {
    loginAccount: { mixedCaseAddress },
    isLogged,
  } = AppStatus.get();
  const isUserDataUpdate = isSameAddress(log.orderCreator, mixedCaseAddress);
  const isUserDataAccount = isSameAddress(log.account, mixedCaseAddress);
  if (isLogged && (isUserDataUpdate || isUserDataAccount)) {
    throttleLoadUserOpenOrders();
  }
};

const handleNewBlockFilledOrdersLog = logs => {
  logs
    .filter(l => l.eventType === OrderEventType.Fill)
    .map(l => handleOrderFilledLog(l));
  const unqMarketIds: string[] = Array.from(new Set(logs.map(l => l.market)));
  unqMarketIds.map((marketId: string) => {
    if (isCurrentMarket(marketId)) {
      updateMarketOrderBook(marketId);
      Markets.actions.bulkMarketTradingHistory(
        null,
        loadMarketTradingHistory(marketId)
      );
      checkUpdateUserPositions([marketId]);
    }
  });
  checkUpdateUserPositions(unqMarketIds);
};

export const handleOrderFilledLog = (log: ParsedOrderEventLog) => {
  const {
    isLogged,
    loginAccount: { address },
  } = AppStatus.get();
  const marketId = log.market;
  const isUserDataUpdate =
    isSameAddress(log.orderCreator, address) ||
    isSameAddress(log.orderFiller, address);
  if (isUserDataUpdate && isLogged) {
    orderFilled(marketId, log, isSameAddress(log.orderCreator, address));
    throttleLoadUserOpenOrders();
    if (log.orderFiller) handleAlert(log, PUBLICFILLORDER, true);
    removePendingOrder(log.tradeGroupId, marketId);
  }
};

export const handleTradingProceedsClaimedLog = (
  log: TradingProceedsClaimedLog
) => {
  const {
    loginAccount: { address },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  if (isSameAddress(log.sender, address)) {
    updateAlert(log.market, {
      name: CLAIMTRADINGPROCEEDS,
      timestamp: currentAugurTimestamp * 1000,
      status: TXEventName.Success,
      params: { ...log },
    });
    removePendingTransaction(CLAIMMARKETSPROCEEDS);
  }
};

// ---- initial reporting ----- //
export const handleInitialReportSubmittedLog = (
  logs: InitialReportSubmittedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  const userLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (userLogs.length > 0) {
    userLogs.map(log => {
      handleAlert(log, DOINITIALREPORT, false);
      removePendingData(log.market, SUBMIT_REPORT);
    });
    loadAccountReportingHistory();
  }
  const marketIds = userLogs.map(log => log.market);
  if (isOnReportingPage()) reloadReportingPage(marketIds);
};

export const handleInitialReporterRedeemedLog = (
  logs: InitialReporterRedeemedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  const reporterLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (reporterLogs.length > 0) {
    loadAccountReportingHistory();
    removePendingTransaction(REDEEMSTAKE);
    reporterLogs.map(log => {
      handleAlert(log, REDEEMSTAKE, false);
    });
  }
};

export const handleInitialReporterTransferredLog = (logs: any) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  const userLogs = logs.filter(
    log => isSameAddress(log.from, address) || isSameAddress(log.to, address)
  );
  if (userLogs.length > 0) {
    loadAccountReportingHistory();
    userLogs.map(log => {
      handleAlert(log, DOINITIALREPORTWARPSYNC, false);
    });
  }
  const marketIds = userLogs.map(log => log.market);
  if (isOnReportingPage()) reloadReportingPage(marketIds);
};
// ---- ------------ ----- //

export const handleProfitLossChangedLog = (
  logs: ProfitLossChangedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0)
    loadAllAccountPositions();
};

export const handleParticipationTokensRedeemedLog = (
  logs: ParticipationTokensRedeemedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  if (logs.filter(log => isSameAddress(log.account, address)).length > 0) {
    logs.map(log => handleAlert({ ...log, marketId: 1 }, REDEEMPARTICIPATIONTOKENS, false));
    loadAccountReportingHistory();
    removePendingTransaction(REDEEMSTAKE);
  }
};

export const handleReportingParticipantDisavowedLog = (
  logs: ReportingParticipantDisavowedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  if (
    logs.filter(log => isSameAddress(log.reportingParticipant, address))
      .length > 0
  ) {
    loadAccountReportingHistory();
  }
};

export const handleMarketParticipantsDisavowedLog = (logs: any) => {
  const marketIds = logs.map(log => log.market);
  marketIds.map(marketId => {
    addPendingData(marketId, DISAVOWCROWDSOURCERS, TXEventName.Success, '0');
  });
  Markets.actions.updateMarketsData(null, loadMarketsInfo(marketIds));
};

export const handleMarketTransferredLog = (logs: any) => {
  const marketIds = logs.map(log => log.market);
  Markets.actions.updateMarketsData(null, loadMarketsInfo(marketIds));
};

export const handleUniverseForkedLog = (log: UniverseForkedLog) => {
  console.log('handleUniverseForkedLog');
  const { forkingMarket } = log;
  loadUniverseForkingInfo(forkingMarket);
  if (isOnDisputingPage()) reloadDisputingPage([]);
};

export const handleMarketFinalizedLog = (logs: MarketFinalizedLog[]) => {
  const {
    universe: { forkingInfo },
  } = AppStatus.get();
  logs.map(log => {
    if (forkingInfo) {
      if (log.market === forkingInfo.forkingMarket) {
        loadUniverseForkingInfo();
      }
    }
  });
  const marketIds = logs.map(m => m.market);
  checkUpdateUserPositions(marketIds);
};

// ---- disputing ----- //
export const handleDisputeCrowdsourcerCreatedLog = (
  logs: DisputeCrowdsourcerCreatedLog[]
) => {
  if (isOnDisputingPage()) reloadDisputingPage([]);
};

export const handleDisputeCrowdsourcerCompletedLog = (
  logs: DisputeCrowdsourcerCompletedLog[]
) => {
  if (isOnDisputingPage()) reloadDisputingPage([]);
};

export const handleDisputeCrowdsourcerContributionLog = (
  logs: DisputeCrowdsourcerContributionLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  const userLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (userLogs.length > 0) {
    logs.map(log => {
      handleAlert(log, CONTRIBUTE, false);
      removePendingData(log.market, SUBMIT_DISPUTE);
    });
    loadAccountReportingHistory();
  }
  if (isOnDisputingPage()) reloadDisputingPage([]);
};

export const handleDisputeCrowdsourcerRedeemedLog = (
  logs: DisputeCrowdsourcerRedeemedLog[]
) => {
  const {
    loginAccount: { address },
  } = AppStatus.get();
  const userLogs = logs.filter(log => isSameAddress(log.reporter, address));
  if (userLogs.length > 0) {
    loadAccountReportingHistory();
    userLogs.map(log => handleAlert(log, REDEEMSTAKE, false));
  }
  removePendingTransaction(REDEEMSTAKE);
};
// ---- ------------ ----- //

export const handleDisputeWindowCreatedLog = (
  logs: DisputeWindowCreatedLog[]
) => {
  if (logs.length > 0) {
    loadDisputeWindow();
    loadAccountReportingHistory();
    if (isOnDisputingPage()) reloadDisputingPage([]);
  }
};

export const handleTokensMintedLog = (logs: TokensMinted[]) => {
  const {
    loginAccount: { address: userAddress },
    universe: { id: universeId, forkingInfo },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const isForking = !!forkingInfo;
  let isParticipationTokens = !!logs.find(
    l => l.tokenType === TokenType.ParticipationToken
  );
  logs
    .filter(log => isSameAddress(log.target, userAddress))
    .map(log => {
      if (log.tokenType === TokenType.ParticipationToken) {
        removePendingTransaction(BUYPARTICIPATIONTOKENS);
        loadAccountReportingHistory();
      }
      if (log.tokenType === TokenType.ReputationToken && isForking) {
        loadUniverseDetails(universeId, userAddress);
      }
      if (log.tokenType === TokenType.ReputationToken && !isForking) {
        const timestamp = currentAugurTimestamp * 1000;
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
        );
        removePendingTransaction(MIGRATE_FROM_LEG_REP_TOKEN);
      }
    });
  if (isParticipationTokens) loadDisputeWindow();
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
};
