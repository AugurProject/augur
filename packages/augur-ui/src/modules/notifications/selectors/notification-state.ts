import { createSelector } from 'reselect';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import {
  selectLoginAccountAddress,
  selectDisputeWindowStats,
  selectPendingLiquidityOrders,
  selectReadNotificationState,
  selectAccountPositionsState,
  selectLoginAccountReportingState,
} from 'store/select-state';

import { createBigNumber } from 'utils/create-big-number';
import {
  NOTIFICATION_TYPES,
  TYPE_DISPUTE,
  TYPE_VIEW_ORDERS,
  TYPE_VIEW_DETAILS,
  RESOLVED_MARKETS_OPEN_ORDERS_TITLE,
  REPORTING_ENDS_SOON_TITLE,
  FINALIZE_MARKET_TITLE,
  CLAIM_REPORTING_FEES_TITLE,
  UNSIGNED_ORDERS_TITLE,
  PROCEEDS_TO_CLAIM_TITLE,
  MARKET_CLOSED,
  REPORTING_STATE,
  ZERO,
} from 'modules/common/constants';
import userOpenOrders from 'modules/orders/selectors/user-open-orders';
import {
  formatDai,
  formatRep,
  formatAttoDai,
  formatAttoRep,
} from 'utils/format-number';
import store from 'store';

// Get all the users CLOSED markets with OPEN ORDERS
export const selectResolvedMarketsOpenOrders = createSelector(
  selectMarkets,
  markets => {
    if (markets.length > 0) {
      return markets
        .filter(market => market.marketStatus === MARKET_CLOSED)
        .filter(market => userOpenOrders(market.id).length > 0)
        .map(getRequiredMarketData);
    }
    return [];
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
        .filter(market => market.designatedReporter === address)
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all the users markets that are in FINALIZATION
export const selectFinalizeMarkets = createSelector(
  selectMarkets,
  selectAccountPositionsState,
  selectLoginAccountAddress,
  (markets, positions, address) => {
    if (markets.length > 0) {
      const positionsMarkets = Object.keys(positions);
      return markets
        .filter(
          market =>
            positionsMarkets.indexOf(market.id) > -1 ||
            address === market.author
        )
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all markets in dispute, for market creators and user with positions in disputed markets
export const selectMarketsInDispute = createSelector(
  selectMarkets,
  selectAccountPositionsState,
  selectLoginAccountAddress,
  (markets, positions, address) => {
    if (markets.length > 0) {
      const positionsMarkets = Object.keys(positions);
      return markets
        .filter(
          market =>
            market.reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE
        )
        .filter(
          market =>
            positionsMarkets.indexOf(market.id) > -1 ||
            market.designatedReporter === address
        )
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get reportingFees for signed in user
export const selectUsersReportingFees = createSelector(
  selectDisputeWindowStats,
  selectLoginAccountReportingState,
  (currentDisputeWindow, userReportingStats) => {
    let unclaimed = {
      unclaimedDai: formatDai(ZERO),
      unclaimedRep: formatRep(ZERO),
    };
    if (
      userReportingStats &&
      userReportingStats.participationTokens &&
      userReportingStats.participationTokens.contracts.length > 0
    ) {
      const calcUnclaimed = userReportingStats.participationTokens.contracts.reduce(
        (p, c) => {
          // filter out current dispute window rep staking
          if (c.address === currentDisputeWindow.address) return p;
          return {
            dai: p.dai.plus(c.amountFees),
            rep: p.rep.plus(createBigNumber(c.amount)),
          };
        },
        { dai: ZERO, rep: ZERO }
      );
      unclaimed = {
        unclaimedDai: formatAttoDai(calcUnclaimed.dai),
        unclaimedRep: formatAttoRep(calcUnclaimed.rep),
      };
    }
    return unclaimed;
  }
);

// Get all unsigned orders from localStorage
export const selectUnsignedOrders = createSelector(
  selectPendingLiquidityOrders,
  selectMarkets,
  (pendingLiquidityOrders, markets) => {
    if (pendingLiquidityOrders) {
      return Object.keys(pendingLiquidityOrders)
        .map(id => markets.find(market => market.id === id))
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
  selectFinalizeMarkets,
  selectMarketsInDispute,
  selectUsersReportingFees,
  selectUnsignedOrders,
  selectReadNotificationState,
  (
    reportOnMarkets,
    resolvedMarketsOpenOrder,
    finalizeMarkets,
    marketsInDispute,
    claimReportingFees,
    unsignedOrders,
    readNotifications
  ) => {
    // Generate non-unquie notifications
    const reportOnMarketsNotifications = generateCards(
      reportOnMarkets,
      NOTIFICATION_TYPES.reportOnMarkets
    );
    const resolvedMarketsOpenOrderNotifications = generateCards(
      resolvedMarketsOpenOrder,
      NOTIFICATION_TYPES.resolvedMarketsOpenOrders
    );
    const finalizeMarketsNotifications = generateCards(
      finalizeMarkets,
      NOTIFICATION_TYPES.finalizeMarkets
    );
    const marketsInDisputeNotifications = generateCards(
      marketsInDispute,
      NOTIFICATION_TYPES.marketsInDispute
    );
    const unsignedOrdersNotifications = generateCards(
      unsignedOrders,
      NOTIFICATION_TYPES.unsignedOrders
    );

    // Add non unquie notifications
    let notifications = [
      ...reportOnMarketsNotifications,
      ...resolvedMarketsOpenOrderNotifications,
      ...finalizeMarketsNotifications,
      ...marketsInDisputeNotifications,
      ...unsignedOrdersNotifications,
    ];

    // Add unquie notifications
    if (
      claimReportingFees &&
      (claimReportingFees.unclaimedDai && claimReportingFees.unclaimedRep)
    ) {
      notifications = notifications.concat({
        type: NOTIFICATION_TYPES.claimReportingFees,
        isImportant: false,
        isNew: true,
        title: CLAIM_REPORTING_FEES_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
        market: null,
        claimReportingFees,
        id: NOTIFICATION_TYPES.claimReportingFees,
      });
    }

    const { accountPositions } = store.getState();
    const claimableMarketInfo = Object.keys(accountPositions).reduce((claimableMarketInfo, marketId) => {
      if (
        accountPositions[marketId] &&
        createBigNumber(
          accountPositions[marketId].tradingPositionsPerMarket
            .totalUnclaimedProceeds
        ).gt(0)
      ) {
        claimableMarketInfo.totalDai = claimableMarketInfo.totalDai.plus(
          createBigNumber(
            accountPositions[marketId].tradingPositionsPerMarket
              .totalUnclaimedProceeds
          )
        );
        claimableMarketInfo.marketIds.push(marketId);
      }
      return claimableMarketInfo;
    }, {marketIds: [], totalDai: ZERO});

    if (createBigNumber(claimableMarketInfo.totalDai).gt(ZERO) && claimableMarketInfo.marketIds.length > 0) {
      notifications = notifications.concat({
        type: NOTIFICATION_TYPES.proceedsToClaim,
        isImportant: false,
        isNew: true,
        title: PROCEEDS_TO_CLAIM_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
        market: null,
        markets: claimableMarketInfo.marketIds,
        totalProceeds: claimableMarketInfo.totalDai.toString(),
        id: NOTIFICATION_TYPES.proceedsToClaim,
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
  let defaults = {};

  if (type === NOTIFICATION_TYPES.resolvedMarketsOpenOrders) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: RESOLVED_MARKETS_OPEN_ORDERS_TITLE,
      buttonLabel: TYPE_VIEW_ORDERS,
    };
  } else if (type === NOTIFICATION_TYPES.reportOnMarkets) {
    defaults = {
      type,
      isImportant: true,
      isNew: true,
      title: REPORTING_ENDS_SOON_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS,
    };
  } else if (type === NOTIFICATION_TYPES.finalizeMarkets) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: FINALIZE_MARKET_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS,
    };
  } else if (type === NOTIFICATION_TYPES.marketsInDispute) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: TYPE_DISPUTE,
      buttonLabel: TYPE_DISPUTE,
    };
  } else if (type === NOTIFICATION_TYPES.unsignedOrders) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: UNSIGNED_ORDERS_TITLE,
      buttonLabel: TYPE_VIEW_ORDERS,
    };
  } else if (type === NOTIFICATION_TYPES.proceedsToClaimOnHold) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: PROCEEDS_TO_CLAIM_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS,
    };
  }

  return markets.map(market => ({
    market,
    ...defaults,
    id: `${type}-${market.id}`,
  }));
};
