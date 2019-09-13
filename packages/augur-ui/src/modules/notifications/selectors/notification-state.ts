import { createSelector } from 'reselect';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import {
  selectLoginAccountAddress,
  selectDisputeWindowStats,
  selectPendingLiquidityOrders,
  selectCurrentTimestampInSeconds,
  selectReadNotificationState,
  selectAccountPositionsState,
  selectLoginAccountReportingState,
} from 'store/select-state';

import { createBigNumber } from 'utils/create-big-number';
// import canClaimProceeds from 'utils/can-claim-proceeds';
import {
  NOTIFICATION_TYPES,
  TYPE_DISPUTE,
  TYPE_VIEW_ORDERS,
  TYPE_VIEW_SETS,
  TYPE_VIEW_DETAILS,
  RESOLVED_MARKETS_OPEN_ORDERS_TITLE,
  REPORTING_ENDS_SOON_TITLE,
  FINALIZE_MARKET_TITLE,
  CLAIM_REPORTING_FEES_TITLE,
  UNSIGNED_ORDERS_TITLE,
  PROCEEDS_TO_CLAIM_TITLE,
  MARKET_CLOSED,
  REPORTING_STATE,
  CONTRACT_INTERVAL,
  ZERO,
} from 'modules/common/constants';
import userOpenOrders from 'modules/orders/selectors/user-open-orders';
import { selectReportingBalances } from 'modules/account/selectors/select-reporting-balances';
import { formatDai, formatRep, formatAttoDai, formatAttoRep } from 'utils/format-number';
import { selectMarket } from 'modules/markets/selectors/market';

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

// Get all markets where the user has outstanding returns
export const selectAllProceedsToClaim = createSelector(
  selectAccountPositionsState,
  positions => {
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!positions')
console.log(positions)
    if (positions && Object.keys(positions).length > 0) {
     return  Object.keys(positions).reduce(
        (p, marketId) =>
          positions[marketId].tradingPositionsPerMarket.totalUnclaimedProceeds
            ? [...p, selectMarket(marketId)]
            : p,
        []
      );
    }
    return [];
  }
);

// export const selectAllProceedsToClaim = createSelector(
//   selectMarkets,
//   markets => {
//     if (markets && markets.length > 0) {
//       return markets
//         .filter(market => market.reportingState === REPORTING_STATE.FINALIZED)
//         .filter(market => market.outstandingReturns);
//     }
//     return [];
//   }
// );

// // Get all markets where the user has outstanding returns and doesn't have to wait CLAIM_PROCEEDS_WAIT_TIME
// export const selectProceedsToClaim = createSelector(
//   selectAllProceedsToClaim,
//   selectCurrentTimestampInSeconds,
//   (markets, currentTimestamp) => {
//     if (markets.length > 0 && currentTimestamp) {
//       return markets
//         .filter(market =>
//           canClaimProceeds(
//             market.finalizationTime,
//             market.outstandingReturns,
//             currentTimestamp
//           )
//         )
//         .map(getRequiredMarketData);
//     }
//     return [];
//   }
// );

// // Get all markets where the user has outstanding returns
// export const selectProceedsToClaimOnHold = createSelector(
//   selectAllProceedsToClaim,
//   markets => {
//     if (markets.length > 0) {
//       return markets
//         .filter(
//           market =>
//             !canClaimProceeds(
//               market.finalizationTime,
//               market.outstandingReturns
//             )
//         )
//         .map(getRequiredMarketData)
//         .map(market => {
//           return {
//             ...market,
//           };
//         });
//     }
//     return [];
//   }
// );

// Get reportingFees for signed in user
export const selectUsersReportingFees = createSelector(
  selectDisputeWindowStats,
  selectLoginAccountReportingState,
  (currentDisputeWindow, userReportingStats) => {
    let unclaimed = { unclaimedDai: formatDai(ZERO), unclaimedRep: formatRep(ZERO) };
    if (
      userReportingStats &&
      userReportingStats.pariticipationTokens &&
      userReportingStats.pariticipationTokens.contracts.length > 0
    ) {
      const calcUnclaimed = userReportingStats.pariticipationTokens.contracts.reduce(
        (p, c) => {
          // filter out current dispute window rep staking
          if (c.address === currentDisputeWindow.address) return p;
          return {
            dai: p.dai.plus(c.fees),
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
  selectAllProceedsToClaim,
  // selectProceedsToClaim,
  // selectProceedsToClaimOnHold,
  selectReadNotificationState,
  (
    reportOnMarkets,
    resolvedMarketsOpenOrder,
    finalizeMarkets,
    marketsInDispute,
    claimReportingFees,
    unsignedOrders,
    proceedsToClaim,
    // proceedsToClaimOnHold,
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
    // const proceedsToClaimOnHoldNotifications = generateCards(
    //   proceedsToClaimOnHold,
    //   NOTIFICATION_TYPES.proceedsToClaimOnHold
    // );

    // Add non unquie notifications
    let notifications = [
      ...reportOnMarketsNotifications,
      ...resolvedMarketsOpenOrderNotifications,
      ...finalizeMarketsNotifications,
      ...marketsInDisputeNotifications,
      ...unsignedOrdersNotifications,
      // ...proceedsToClaimOnHoldNotifications,
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
console.log("IN notification-state");
console.log(proceedsToClaim);
proceedsToClaim = [{
  id: '0x0000000000000000000000000000000000000000',
  description: '',
  endTime: '',
  reportingState: '',
  marketStatus: '',
  disputeInfo: '',
  myPositionsSummary: '',
  outstandingReturns: 10,
  finalizationTime: '',
}];
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
          markets: marketIds,
          totalProceeds: totalEth.toNumber(),
          id: NOTIFICATION_TYPES.proceedsToClaim,
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
