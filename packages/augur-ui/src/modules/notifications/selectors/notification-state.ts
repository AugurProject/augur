import { MarketReportingState } from '@augurproject/sdk-lite';
import store, { AppState } from 'appStore';
import {
  selectAccountPositionsState,
  selectLoginAccountAddress,
  selectMarketInfosState,
  selectPendingLiquidityOrders,
  selectReadNotificationState,
  selectUserMarketOpenOrders,
} from 'appStore/select-state';
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
} from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import userOpenOrders from 'modules/orders/selectors/user-open-orders';
import { selectLoginAccountClaimablePositions } from 'modules/positions/selectors/login-account-claimable-winnings';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import {
  MarketClaimablePositions,
  MarketReportClaimableContracts,
} from 'modules/types';
import { createSelector } from 'reselect';
import { isSameAddress } from 'utils/isSameAddress';

// Get all the users CLOSED markets with OPEN ORDERS
export const selectResolvedMarketsOpenOrders = createSelector(
  selectUserMarketOpenOrders,
  openOrders => {
    return Object.keys(openOrders)
      .map(id => selectMarket(id))
      .filter(
        market =>
        market && (market.reportingState == REPORTING_STATE.AWAITING_FINALIZATION ||
          market.reportingState === REPORTING_STATE.FINALIZED)
      )
      .filter(market => userOpenOrders(market.id).length > 0)
      .map(getRequiredMarketData);
  }
);

export const selectMostLikelyInvalidMarkets = createSelector(
  selectMarketInfosState,
  selectUserMarketOpenOrders,
  selectAccountPositionsState,
  (markets, openOrders, positions) => {
    let marketIds = Object.keys(positions);
    return Object.keys(openOrders)
      .map(id => selectMarket(id))
      .filter(
        market =>
          market && market.mostLikelyInvalid
      )
      .filter(market => (userOpenOrders(market.id).length > 0 || marketIds.includes(market.id)))
      .map(getRequiredMarketData);
  }
);

// Get all the users markets that are in DESIGNATED_REPORTING where they are the REPORTER
export const selectReportOnMarkets = createSelector(
  selectMarkets,
  selectLoginAccountAddress,
  (markets, address) => {
    if (markets.length > 0) {
      return markets
        .filter(
          market =>
            market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING
        )
        .filter(market => isSameAddress(market.designatedReporter, address))
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Tell user they can get REP if they finalize warp sync market
export const selectFinalizeMarkets = createSelector(
  selectMarketInfosState,
  marketInfos => {
    const marketId = Object.keys(marketInfos).filter(
      id => marketInfos[id].reportingState === REPORTING_STATE.AWAITING_FINALIZATION && marketInfos[id].isWarpSync
    );
    if (marketId.length > 0) {
      return marketId.map(id => selectMarket(id)).map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all markets in dispute, for market creators and user with positions in disputed markets
export const selectMarketsInDispute = createSelector(
  selectMarketInfosState,
  selectAccountPositionsState,
  selectLoginAccountAddress,
  (markets, positions, address) => {
    const state = store.getState() as AppState;
    let marketIds = Object.keys(positions);
    const { reporting } = state.loginAccount;
    if (reporting && reporting.disputing && reporting.disputing.contracts) {
      marketIds = Array.from(
        new Set([
          ...marketIds,
          ...state.loginAccount.reporting.disputing.contracts.map(
            obj => obj.marketId
          ),
        ])
      );
    }
    if (reporting && reporting.reporting && reporting.reporting.contracts) {
      marketIds = Array.from(
        new Set([
          ...marketIds,
          ...state.loginAccount.reporting.reporting.contracts.map(
            obj => obj.marketId
          ),
        ])
      );
    }
    marketIds = Array.from(
      new Set([
        ...marketIds,
        ...Object.keys(markets).filter(id => markets[id].author === address),
      ])
    );
    if (marketIds.length > 0) {
      return marketIds
        .reduce((p, id) => {
          const market = selectMarket(id);
          if (!market) return p;
          if (
            market.reportingState !==
              MarketReportingState.CrowdsourcingDispute ||
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
  }
);

// Get reportingFees for signed in user
export const selectUsersReportingFees: MarketReportClaimableContracts = selectReportingWinningsByMarket(
  store.getState() as AppState
);

// Get all unsigned orders from localStorage
export const selectUnsignedOrders = createSelector(
  selectPendingLiquidityOrders,
  selectMarkets,
  (pendingLiquidityOrders, markets) => {
    if (pendingLiquidityOrders) {
      return Object.keys(pendingLiquidityOrders)
        .map(id => markets.find(market => market.transactionHash === id))
        .filter(notification => notification)
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Returns all notifications currently relevant to the user.
export const selectNotifications = createSelector(
  selectReportOnMarkets,
  selectResolvedMarketsOpenOrders,
  selectMarketsInDispute,
  selectReportingWinningsByMarket,
  selectUnsignedOrders,
  selectMostLikelyInvalidMarkets,
  selectFinalizeMarkets,
  selectReadNotificationState,
  (
    reportOnMarkets,
    resolvedMarketsOpenOrder,
    marketsInDispute,
    claimReportingFees,
    unsignedOrders,
    mostLikelyInvalidMarkets,
    finalizeMarkets,
    readNotifications,
  ): Notification[] => {
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
      ...finalizeNotifications
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
        title: CLAIM_REPORTING_FEES_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
        market: null,
        claimReportingFees,
        queueName: TRANSACTIONS,
        queueId: REDEEMSTAKE,
        id: NOTIFICATION_TYPES.claimReportingFees,
      });
    }

    const accountMarketClaimablePositions: MarketClaimablePositions = selectLoginAccountClaimablePositions(
      store.getState()
    );
    if (accountMarketClaimablePositions.markets.length > 0) {
      notifications = notifications.concat({
        type: NOTIFICATION_TYPES.proceedsToClaim,
        isImportant: false,
        isNew: true,
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
    const storedNotifications = readNotifications || null;
    if (storedNotifications && storedNotifications.length) {
      notifications = notifications.map(notification => {
        const storedNotification = storedNotifications.find(
          storedNotification => storedNotification.id === notification.id
        );
        if (storedNotification) {
          notification.isNew = storedNotification.isNew;
          notification.hideNotification = storedNotification.hideNotification;
        }
        return notification;
      });
    }
    return notifications;
  }
);

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
});

// Build notification objects and include market data
const generateCards = (markets, type) => {
  const getDefaults = market => {
    let defaults = {};
    if (type === NOTIFICATION_TYPES.resolvedMarketsOpenOrders) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
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
        title: REPORTING_ENDS_SOON_TITLE,
        buttonLabel: TYPE_REPORT,
        queueName: SUBMIT_REPORT
      };
    } else if (type === NOTIFICATION_TYPES.marketsInDispute) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        title: TYPE_DISPUTE,
        buttonLabel: TYPE_DISPUTE,
        queueName: SUBMIT_DISPUTE,
      };
    } else if (type === NOTIFICATION_TYPES.unsignedOrders) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        title: SIGN_SEND_ORDERS,
        buttonLabel: TYPE_VIEW_ORDERS,
      };
    } else if (type === NOTIFICATION_TYPES.proceedsToClaim) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
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
        title: MARKET_IS_MOST_LIKELY_INVALID_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
      };
    } else if (type === NOTIFICATION_TYPES.finalizeMarket) {
      defaults = {
        type,
        isImportant: false,
        isNew: true,
        title: 'Finalize Warp Sync Market',
        buttonLabel: TYPE_VIEW_DETAILS,
        queueName: TRANSACTIONS,
        queueId: FINALIZE,
      };
    }
    return defaults;
  }
  return markets.map(market => ({
    market,
    ...getDefaults(market),
    id: `${type}-${market.id}`,
  }));
};
