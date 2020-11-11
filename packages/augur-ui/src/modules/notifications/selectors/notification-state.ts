import { MarketReportingState } from '@augurproject/sdk-lite';
import {
  CANCELORDERS,
  CLAIM_REPORTING_FEES_TITLE,
  CLAIMMARKETSPROCEEDS,
  FINALIZE,
  MARKET_IS_MOST_LIKELY_INVALID_TITLE,
  NOTIFICATION_TYPES,
  PROCEEDS_TO_CLAIM_TITLE,
  REDEEMSTAKE,
  REPORTING_ENDS_SOON_TITLE,
  REPORTING_STATE,
  RESOLVED_MARKETS_OPEN_ORDERS_TITLE,
  SIGN_SEND_ORDERS,
  SUBMIT_DISPUTE,
  SUBMIT_REPORT,
  TRANSACTIONS,
  TYPE_DISPUTE,
  TYPE_REPORT,
  TYPE_VIEW_DETAILS,
  TYPE_VIEW_ORDERS,
  ZERO,
  THEMES,
  LIQUIDITY_ORDERS,
} from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import userOpenOrders from 'modules/orders/selectors/user-open-orders';
import {
  MarketClaimablePositions,
  MarketReportClaimableContracts,
  Notification,
} from 'modules/types';
import { getLoginAccountClaimableWinnings } from 'modules/positions/selectors/login-account-claimable-winnings';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { isSameAddress } from 'utils/isSameAddress';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';
import { PendingOrders } from 'modules/app/store/pending-orders';

// Get all the users CLOSED markets with OPEN ORDERS
export const selectResolvedMarketsOpenOrders = () => {
  const { userOpenOrders: openOrders } = AppStatus.get();
  return Object.keys(openOrders)
    .map(id => selectMarket(id))
    .filter(
      market =>
        market &&
        (market.reportingState == REPORTING_STATE.AWAITING_FINALIZATION ||
          market.reportingState === REPORTING_STATE.FINALIZED)
    )
    .filter(market => userOpenOrders(market.id).length > 0)
    .map(getRequiredMarketData);
};

export const selectMostLikelyInvalidMarkets = () => {
  const { accountPositions } = AppStatus.get();
  return Object.keys(accountPositions)
    .map(id => selectMarket(id))
    .filter(market => market && market.mostLikelyInvalid)
    .map(getRequiredMarketData);
};

// Get all the users markets that are in DESIGNATED_REPORTING where they are the REPORTER
export const selectReportOnMarkets = () => {
  const markets = selectMarkets();
  const {
    loginAccount: { address },
  } = AppStatus.get();
  if (markets.length > 0) {
    return markets
      .filter(
        market => market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING
      )
      .filter(market => isSameAddress(market.designatedReporter, address))
      .map(getRequiredMarketData);
  }
  return [];
};

// Tell user they can get REPv2 if they finalize warp sync market
export const selectFinalizeMarkets = () => {
  const { marketInfos } = Markets.get();
  const marketId = Object.keys(marketInfos).filter(
    id =>
      marketInfos[id].reportingState ===
        REPORTING_STATE.AWAITING_FINALIZATION && marketInfos[id].isWarpSync
  );
  if (marketId.length > 0) {
    return marketId.map(id => selectMarket(id)).map(getRequiredMarketData);
  }
  return [];
};

// Get all markets in dispute, for market creators and user with positions in disputed markets
export const selectMarketsInDispute = () => {
  const {
    accountPositions: positions,
    loginAccount: { address },
    theme
  } = AppStatus.get();
  if (theme === THEMES.SPORTS) return [];
  const { marketInfos } = Markets.get();
  let marketIds = Object.keys(positions);
  const {
    loginAccount: { reporting },
  } = AppStatus.get();
  if (reporting && reporting.disputing && reporting.disputing.contracts) {
    marketIds = Array.from(
      new Set([
        ...marketIds,
        ...reporting.disputing.contracts.map(obj => obj.marketId),
      ])
    );
  }
  if (reporting && reporting.reporting && reporting.reporting.contracts) {
    marketIds = Array.from(
      new Set([
        ...marketIds,
        ...reporting.reporting.contracts.map(obj => obj.marketId),
      ])
    );
  }
  marketIds = Array.from(
    new Set([
      ...marketIds,
      ...Object.keys(marketInfos).filter(
        id => marketInfos[id].author === address
      ),
    ])
  );
  if (marketIds.length > 0) {
    return marketIds
      .reduce((p, id) => {
        const market = selectMarket(id);
        if (!market) return p;
        if (
          market.reportingState !== MarketReportingState.CrowdsourcingDispute ||
          !market.disputeInfo ||
          !market.disputeInfo.disputeWindow ||
          market.disputeInfo.disputeWindow.disputeRound === '1'
        )
          return p;
        return [...p, market];
      }, [])
      .map(getRequiredMarketData);
  }
  return [];
};

// Get reportingFees for signed in user
export const selectUsersReportingFees: MarketReportClaimableContracts = selectReportingWinningsByMarket();

// Get all unsigned orders from localStorage
export const selectUnsignedOrders = () => {
  const markets = selectMarkets();
  const { pendingLiquidityOrders } = PendingOrders.get();
  if (pendingLiquidityOrders) {
    return Object.keys(pendingLiquidityOrders)
      .map(id => markets.find(market => market.transactionHash === id))
      .filter(notification => notification)
      .map(getRequiredMarketData);
  }
  return [];
};

// Returns all notifications currently relevant to the user.
export const getNotifications = (): Notification[] => {
  const reportOnMarkets = selectReportOnMarkets();
  const resolvedMarketsOpenOrder = selectResolvedMarketsOpenOrders();
  const marketsInDispute = selectMarketsInDispute();
  const claimReportingFees = selectReportingWinningsByMarket();
  const unsignedOrders = selectUnsignedOrders();
  const mostLikelyInvalidMarkets = selectMostLikelyInvalidMarkets();
  const finalizeMarkets = selectFinalizeMarkets();
  const { notifications: notificationsState, loginAccount: { reporting }, accountPositions } = AppStatus.get();
  // Generate non-unquie notifications
  const reportOnMarketsNotifications = generateCards(
    reportOnMarkets,
    NOTIFICATION_TYPES.reportOnMarkets
  );
  const resolvedMarketsOpenOrderNotifications = generateCards(
    resolvedMarketsOpenOrder,
    NOTIFICATION_TYPES.resolvedMarketsOpenOrders
  );
  const marketsInDisputeNotifications = generateCards(
    marketsInDispute,
    NOTIFICATION_TYPES.marketsInDispute
  );
  const unsignedOrdersNotifications = generateCards(
    unsignedOrders,
    NOTIFICATION_TYPES.unsignedOrders
  );
  const mostLikelyInvalidMarketsNotifications = generateCards(
    mostLikelyInvalidMarkets,
    NOTIFICATION_TYPES.marketIsMostLikelyInvalid
  );
  const finalizeNotifications = generateCards(
    finalizeMarkets,
    NOTIFICATION_TYPES.finalizeMarket
  );
  // Add non unquie notifications
  let notifications = [
    ...reportOnMarketsNotifications,
    ...resolvedMarketsOpenOrderNotifications,
    ...marketsInDisputeNotifications,
    ...unsignedOrdersNotifications,
    ...mostLikelyInvalidMarketsNotifications,
    ...finalizeNotifications,
  ];

  // Add unquie notifications
  if (
    claimReportingFees &&
    (claimReportingFees.participationContracts.unclaimedDai.gt(ZERO) ||
      claimReportingFees.participationContracts.unclaimedRep.gt(ZERO) ||
      claimReportingFees.claimableMarkets.unclaimedRep.gt(ZERO))
  ) {
    notifications = notifications.concat({
      type: NOTIFICATION_TYPES.claimReportingFees,
      isImportant: false,
      isNew: true,
      isRead: false,
      title: CLAIM_REPORTING_FEES_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS,
      market: null,
      claimReportingFees,
      queueName: TRANSACTIONS,
      queueId: REDEEMSTAKE,
      id: NOTIFICATION_TYPES.claimReportingFees,
    });
  }

  const accountMarketClaimablePositions: MarketClaimablePositions = getLoginAccountClaimableWinnings();
  if (accountMarketClaimablePositions.markets.length > 0) {
    notifications = notifications.concat({
      type: NOTIFICATION_TYPES.proceedsToClaim,
      isImportant: false,
      isNew: true,
      isRead: false,
      title: PROCEEDS_TO_CLAIM_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS,
      market: null,
      markets: accountMarketClaimablePositions.markets,
      totalProceeds: accountMarketClaimablePositions.totals.totalUnclaimedProceeds.toString(),
      id: NOTIFICATION_TYPES.proceedsToClaim,
      queueName: TRANSACTIONS,
      queueId: CLAIMMARKETSPROCEEDS,
    });
  }

  // Update isNew status based on data stored on local state
  const storedNotifications = notificationsState || null;
  if (storedNotifications && storedNotifications.length) {
    notifications = notifications.map(notification => {
      const storedNotification = storedNotifications.find(
        storedNotification => storedNotification.id === notification.id
      );
      if (storedNotification) {
        notification.isNew = storedNotification.isNew;
        notification.isRead = storedNotification.isRead;
        notification.hideNotification = storedNotification.hideNotification;
        notification.lastUpdated = storedNotification.lastUpdated;
      }
      return notification;
    });
  }
  return notifications;
};

// Return only market data we require for notifications
const getRequiredMarketData = market => ({
  id: market.id,
  description: market.description,
  endTime: market.endTime,
  reportingState: market.reportingState,
  marketStatus: market.marketStatus,
  disputeInfo: market.disputeInfo || {},
  myPositionsSummary: market.myPositionsSummary || {},
  outstandingReturns: market.outstandingReturns || null,
  finalizationTime: market.finalizationTime,
  transactionHash: market.transactionHash
});

// Build notification objects and include market data
const generateCards = (markets, type) => {
  const getDefaults = market => {
    let defaults = {};
    const lastUpdated = new Date().getTime();
    if (type === NOTIFICATION_TYPES.resolvedMarketsOpenOrders) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: RESOLVED_MARKETS_OPEN_ORDERS_TITLE,
        buttonLabel: TYPE_VIEW_ORDERS,
        queueName: CANCELORDERS,
        queueId: market.id,
      };
    } else if (type === NOTIFICATION_TYPES.reportOnMarkets) {
      defaults = {
        type,
        isImportant: true,
        redIcon: true,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: REPORTING_ENDS_SOON_TITLE,
        buttonLabel: TYPE_REPORT,
        queueName: SUBMIT_REPORT,
      };
    } else if (type === NOTIFICATION_TYPES.marketsInDispute) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: TYPE_DISPUTE,
        buttonLabel: TYPE_DISPUTE,
        queueName: SUBMIT_DISPUTE,
      };
    } else if (type === NOTIFICATION_TYPES.unsignedOrders) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: SIGN_SEND_ORDERS,
        buttonLabel: TYPE_VIEW_ORDERS,
        queueName: LIQUIDITY_ORDERS,
        queueId: market.transactionHash,
        dontShowNotificationButton: true
      };
    } else if (type === NOTIFICATION_TYPES.proceedsToClaim) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: PROCEEDS_TO_CLAIM_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
        queueName: TRANSACTIONS,
        queueId: CLAIMMARKETSPROCEEDS,
      };
    } else if (type === NOTIFICATION_TYPES.marketIsMostLikelyInvalid) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: MARKET_IS_MOST_LIKELY_INVALID_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
      };
    } else if (type === NOTIFICATION_TYPES.finalizeMarket) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        isRead: false,
        lastUpdated,
        title: 'Finalize Warp Sync Market',
        buttonLabel: TYPE_VIEW_DETAILS,
        queueName: TRANSACTIONS,
        queueId: FINALIZE,
      };
    }
    return defaults;
  };
  return markets.map(market => ({
    market,
    ...getDefaults(market),
    id: `${type}-${market.id}`,
  }));
};
