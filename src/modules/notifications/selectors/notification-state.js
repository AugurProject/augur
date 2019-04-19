import { createSelector } from "reselect";
import { selectMarkets } from "src/modules/markets/selectors/markets-all";
import {
  selectLoginAccountAddress,
  selectReportingWindowStats,
  selectPendingLiquidityOrders,
  selectCurrentTimestampInSeconds,
  selectReadNotificationState,
  selectOrphanOrders
} from "src/select-state";

import { createBigNumber } from "utils/create-big-number";
import canClaimProceeds from "utils/can-claim-proceeds";
import { constants } from "services/constants";
import {
  NOTIFICATION_TYPES,
  TYPE_DISPUTE,
  TYPE_VIEW_ORDERS,
  TYPE_VIEW_SETS,
  TYPE_VIEW_DETAILS,
  RESOLVED_MARKETS_OPEN_ORDERS_TITLE,
  REPORTING_ENDS_SOON_TITLE,
  FINALIZE_MARKET_TITLE,
  SELL_COMPLETE_SETS_TITLE,
  CLAIM_REPORTING_FEES_TITLE,
  UNSIGNED_ORDERS_TITLE,
  PROCEEDS_TO_CLAIM_TITLE,
  ORPHAN_ORDERS_TITLE,
  MARKET_CLOSED
} from "modules/common-elements/constants";

// Get all the users CLOSED markets with OPEN ORDERS
export const selectResolvedMarketsOpenOrders = createSelector(
  selectMarkets,
  markets => {
    if (markets.length > 0) {
      return markets
        .filter(market => market.marketStatus === MARKET_CLOSED)
        .filter(market => market.userOpenOrders.length > 0)
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
            market.reportingState ===
            constants.REPORTING_STATE.DESIGNATED_REPORTING
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
  selectLoginAccountAddress,
  (markets, address) => {
    if (markets.length > 0) {
      return markets
        .filter(
          market =>
            market.reportingState ===
            constants.REPORTING_STATE.AWAITING_FINALIZATION
        )
        .filter(
          market => market.userPositions.length > 0 || address === market.author
        )
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all the users markets where the user has COMPLETE SETS of SHARES
export const selectCompleteSetPositions = createSelector(
  selectMarkets,
  markets => {
    if (markets.length > 0) {
      return markets
        .filter(market => {
          const numCompleteSets =
            (market.myPositionsSummary &&
              market.myPositionsSummary.numCompleteSets) ||
            undefined;
          return numCompleteSets && numCompleteSets.value > 0;
        })
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all markets in dispute, for market creators and user with positions in disputed markets
export const selectMarketsInDispute = createSelector(
  selectMarkets,
  selectLoginAccountAddress,
  (markets, address) => {
    if (markets.length > 0) {
      return markets
        .filter(
          market =>
            market.reportingState ===
            constants.REPORTING_STATE.CROWDSOURCING_DISPUTE
        )
        .filter(
          market =>
            market.userPositions.length > 0 ||
            market.designatedReporter === address
        )
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all markets where the user has outstanding returns
export const selectAllProceedsToClaim = createSelector(
  selectMarkets,
  markets => {
    if (markets && markets.length > 0) {
      return markets
        .filter(
          market =>
            market.reportingState === constants.REPORTING_STATE.FINALIZED
        )
        .filter(market => market.outstandingReturns);
    }
    return [];
  }
);

// Get all markets where the user has outstanding returns and doesn't have to wait CLAIM_PROCEEDS_WAIT_TIME
export const selectProceedsToClaim = createSelector(
  selectAllProceedsToClaim,
  selectCurrentTimestampInSeconds,
  (markets, currentTimestamp) => {
    if (markets.length > 0 && currentTimestamp) {
      return markets
        .filter(market =>
          canClaimProceeds(
            market.finalizationTime,
            market.outstandingReturns,
            currentTimestamp
          )
        )
        .map(getRequiredMarketData);
    }
    return [];
  }
);

// Get all markets where the user has outstanding returns but needs to wait CLAIM_PROCEEDS_WAIT_TIME
export const selectProceedsToClaimOnHold = createSelector(
  selectAllProceedsToClaim,
  selectCurrentTimestampInSeconds,
  (markets, currentTimestamp) => {
    if (markets.length > 0 && currentTimestamp) {
      return markets
        .filter(
          market =>
            !canClaimProceeds(
              market.finalizationTime,
              market.outstandingReturns,
              currentTimestamp
            )
        )
        .map(getRequiredMarketData)
        .map(market => {
          const finalizationTimeWithHold = createBigNumber(
            market.finalizationTime
          )
            .plus(
              createBigNumber(
                constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME
              )
            )
            .toNumber();

          return {
            ...market,
            finalizationTimeWithHold
          };
        });
    }
    return [];
  }
);

// Get reportingFees for signed in user
export const selectUsersReportingFees = createSelector(
  selectReportingWindowStats,
  reportingWindowStats => {
    if (reportingWindowStats && reportingWindowStats.reportingFees) {
      const { unclaimedEth, unclaimedRep } = reportingWindowStats.reportingFees;
      if (
        (unclaimedEth && unclaimedEth.value > 0) ||
        (unclaimedRep && unclaimedRep.value > 0)
      ) {
        return reportingWindowStats.reportingFees;
      }
    }
    return {};
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

// Get all orphan orders state
export const selectAllOrphanOrders = createSelector(
  selectOrphanOrders,
  selectMarkets,
  (orphanOrders, markets) => {
    if (orphanOrders) {
      return markets
        .filter(market =>
          orphanOrders.find(order => order.marketId === market.id)
        )
        .map(getRequiredMarketData)
        .map(notification => ({
          ...notification,
          orphanOrdersPerMarket: orphanOrders.filter(orders => notification.id)
            .length
        }));
    }
    return [];
  }
);

// Returns all notifications currently relevant to the user.
export const selectNotifications = createSelector(
  selectReportOnMarkets,
  selectResolvedMarketsOpenOrders,
  selectFinalizeMarkets,
  selectCompleteSetPositions,
  selectMarketsInDispute,
  selectUsersReportingFees,
  selectUnsignedOrders,
  selectProceedsToClaim,
  selectProceedsToClaimOnHold,
  selectReadNotificationState,
  selectAllOrphanOrders,
  (
    reportOnMarkets,
    resolvedMarketsOpenOrder,
    finalizeMarkets,
    completeSetPositions,
    marketsInDispute,
    claimReportingFees,
    unsignedOrders,
    proceedsToClaim,
    proceedsToClaimOnHold,
    readNotifications,
    orphanOrders
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
    const completeSetPositionsNotifications = generateCards(
      completeSetPositions,
      NOTIFICATION_TYPES.completeSetPositions
    );
    const marketsInDisputeNotifications = generateCards(
      marketsInDispute,
      NOTIFICATION_TYPES.marketsInDispute
    );
    const unsignedOrdersNotifications = generateCards(
      unsignedOrders,
      NOTIFICATION_TYPES.unsignedOrders
    );
    const proceedsToClaimOnHoldNotifications = generateCards(
      proceedsToClaimOnHold,
      NOTIFICATION_TYPES.proceedsToClaimOnHold
    );

    const orphanOrdersNotifications = generateCards(
      orphanOrders,
      NOTIFICATION_TYPES.orphanOrders
    );

    // Add non unquie notifications
    let notifications = [
      ...reportOnMarketsNotifications,
      ...resolvedMarketsOpenOrderNotifications,
      ...finalizeMarketsNotifications,
      ...completeSetPositionsNotifications,
      ...marketsInDisputeNotifications,
      ...unsignedOrdersNotifications,
      ...proceedsToClaimOnHoldNotifications,
      ...orphanOrdersNotifications
    ];

    // Add unquie notifications
    if (
      claimReportingFees &&
      (claimReportingFees.unclaimedEth && claimReportingFees.unclaimedRep)
    ) {
      notifications = notifications.concat({
        type: NOTIFICATION_TYPES.claimReportingFees,
        isImportant: false,
        isNew: true,
        title: CLAIM_REPORTING_FEES_TITLE,
        buttonLabel: TYPE_VIEW_DETAILS,
        market: null,
        claimReportingFees,
        id: NOTIFICATION_TYPES.claimReportingFees
      });
    }

    if (proceedsToClaim && proceedsToClaim.length > 0) {
      let totalEth = createBigNumber(0);

      const marketIds = proceedsToClaim.map(market => market.id);
      proceedsToClaim.forEach(market => {
        totalEth = totalEth.plus(
          createBigNumber(Number(market.outstandingReturns || 0))
        );
      });

      if (totalEth.toNumber() > 0 && marketIds.length > 0) {
        notifications = notifications.concat({
          type: NOTIFICATION_TYPES.proceedsToClaim,
          isImportant: false,
          isNew: true,
          title: PROCEEDS_TO_CLAIM_TITLE,
          buttonLabel: TYPE_VIEW_DETAILS,
          market: null,
          marketes: marketIds,
          totalProceeds: totalEth.toNumber(),
          id: NOTIFICATION_TYPES.proceedsToClaim
        });
      }
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
  finalizationTime: market.finalizationTime
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
      buttonLabel: TYPE_VIEW_ORDERS
    };
  } else if (type === NOTIFICATION_TYPES.reportOnMarkets) {
    defaults = {
      type,
      isImportant: true,
      isNew: true,
      title: REPORTING_ENDS_SOON_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS
    };
  } else if (type === NOTIFICATION_TYPES.finalizeMarkets) {
    defaults = {
      type,
      isImportant: true,
      isNew: true,
      title: FINALIZE_MARKET_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS
    };
  } else if (type === NOTIFICATION_TYPES.marketsInDispute) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: TYPE_DISPUTE,
      buttonLabel: TYPE_DISPUTE
    };
  } else if (type === NOTIFICATION_TYPES.completeSetPositions) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: SELL_COMPLETE_SETS_TITLE,
      buttonLabel: TYPE_VIEW_SETS
    };
  } else if (type === NOTIFICATION_TYPES.unsignedOrders) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: UNSIGNED_ORDERS_TITLE,
      buttonLabel: TYPE_VIEW_ORDERS
    };
  } else if (type === NOTIFICATION_TYPES.proceedsToClaimOnHold) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: PROCEEDS_TO_CLAIM_TITLE,
      buttonLabel: TYPE_VIEW_DETAILS
    };
  } else if (type === NOTIFICATION_TYPES.orphanOrders) {
    defaults = {
      type,
      isImportant: false,
      isNew: true,
      title: ORPHAN_ORDERS_TITLE,
      buttonLabel: TYPE_VIEW_ORDERS
    };
  }

  return markets.map(market => ({
    market,
    ...defaults,
    id: `${type}-${market.id}`
  }));
};
