import BigNumber from "bignumber.js";
import { addAlert, updateAlert } from "modules/alerts/actions/alerts";
import {
  loadMarketAccountPositions,
  loadAccountPositionsTotals
} from "modules/positions/actions/load-account-positions";
import { loadMarketOpenOrders } from "modules/orders/actions/load-market-open-orders";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { updateLoggedTransactions } from "modules/transactions/actions/convert-logs-to-transactions";
import { removeMarket } from "modules/markets/actions/update-markets-data";
import { updateOutcomePrice } from "modules/markets/actions/update-outcome-price";
import { removeCanceledOrder } from "modules/orders/actions/update-order-status";
import { defaultLogHandler } from "modules/events/actions/default-log-handler";
import { isCurrentMarket } from "modules/trades/helpers/is-current-market";
import logError from "utils/log-error";
import makePath from "modules/routes/helpers/make-path";
import { MY_MARKETS, TRANSACTIONS } from "modules/routes/constants/views";
import { loadReporting } from "src/modules/reports/actions/load-reporting";
import { loadDisputing } from "modules/reports/actions/load-disputing";
import loadCategories from "modules/categories/actions/load-categories";
import { getReportingFees } from "modules/reports/actions/get-reporting-fees";
import {
  loadMarketsInfo,
  loadMarketsInfoIfNotLoaded,
  loadMarketsDisputeInfo
} from "src/modules/markets/actions/load-markets-info";
import { loadUnclaimedFees } from "modules/markets/actions/market-creator-fees-management";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import { startOrderSending } from "modules/orders/actions/liquidity-management";
import {
  loadMarketTradingHistory,
  loadUserMarketTradingHistory
} from "modules/markets/actions/market-trading-history-management";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { appendCategoryIfNew } from "modules/categories/actions/append-category";
import { removePendingOrder } from "modules/orders/actions/pending-orders-management";
import { loadAccountOpenOrders } from "modules/orders/actions/load-account-open-orders";
import { loadUsershareBalances } from "modules/positions/actions/load-user-share-balances";

const handleAlertUpdate = (log, dispatch, getState) => {
  dispatch(
    updateAlert(log.transactionHash, {
      id: log.transactionHash,
      timestamp: selectCurrentTimestampInSeconds(getState()),
      blockNumber: log.blockNumber,
      log,
      status: "Confirmed",
      linkPath: makePath(TRANSACTIONS),
      seen: false // Manually set to false to ensure alert
    })
  );
};

const handlePendingOrder = (log, dispatch, getState) => {
  dispatch(removePendingOrder(log.transactionHash, log.marketId));
};

const loadUserPositionsAndBalances = marketId => dispatch => {
  dispatch(loadMarketAccountPositions(marketId));
  dispatch(loadUsershareBalances([marketId]));
  dispatch(getWinningBalance([marketId]));
};

export const handleMarketStateLog = log => dispatch => {
  dispatch(
    loadMarketsInfo([log.marketId], () => {
      dispatch(loadReporting([log.marketId]));
    })
  );
};

export const handleMarketCreatedLog = log => (dispatch, getState) => {
  const isStoredTransaction =
    log.marketCreator === getState().loginAccount.address;
  if (log.removed) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(
      loadMarketsInfo([log.market], err => {
        if (err) {
          logError(err);
          return;
        }

        // When a new market is created, we might reload all categories with
        // `dispatch(loadCategories())`, but this can cause UI jitter, so
        // instead we'll append the new market's category if it doesn't exist.
        appendCategoryIfNew(
          dispatch,
          getState().categories,
          getState().marketsData[log.market]
        );
      })
    );
    // dispatch(loadCategories()); don't reload categories because when market created log comes in, this event will cause the categories to load and re-sort which causes the category list to change. If markets are being traded (OI an change) then multiple markets are getting created there is potential for the user's category list to appear erratic as the list resorts over and over. In future, we might check if the new market's category is new, and append that category to end of categories without user seeing a jittery re-render.
  }
  if (isStoredTransaction) {
    handleAlertUpdate(log, dispatch, getState);
    dispatch(updateAssets());

    // My Market? start kicking off liquidity orders
    if (!log.removed) dispatch(startOrderSending({ marketId: log.market }));
    dispatch(updateLoggedTransactions(log));
  }
};

export const handleMarketMigratedLog = log => (dispatch, getState) => {
  const universeId = getState().universe.id;
  if (log.originalUniverse === universeId) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(loadMarketsInfo([log.market]));
  }
  dispatch(loadCategories());
};

export const handleTokensTransferredLog = log => (dispatch, getState) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.from === address || log.to === address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(loadReportingWindowBounds());
    handleAlertUpdate(log, dispatch, getState);
  }
};

export const handleTokensMintedLog = log => (dispatch, getState) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.target === address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(loadReportingWindowBounds());
    dispatch(defaultLogHandler(log));
  }
};

export const handleTokensBurnedLog = log => (dispatch, getState) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.target === address;
  if (isStoredTransaction) {
    handleAlertUpdate(log, dispatch, getState);
  }
};

export const handleOrderCreatedLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfoIfNotLoaded([log.marketId]));
  const isStoredTransaction =
    log.orderCreator === getState().loginAccount.address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    handlePendingOrder(log, dispatch, getState);
    handleAlertUpdate(log, dispatch, getState);
    dispatch(loadAccountOpenOrders({ marketId: log.marketId }));
    dispatch(loadAccountPositionsTotals());
  }
  if (isCurrentMarket(log.marketId))
    dispatch(loadMarketOpenOrders(log.marketId));
};

export const handleOrderCanceledLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfoIfNotLoaded([log.marketId]));
  const isStoredTransaction = log.sender === getState().loginAccount.address;
  if (isStoredTransaction) {
    if (!log.removed) dispatch(removeCanceledOrder(log.orderId));
    handleAlertUpdate(log, dispatch, getState);
    dispatch(updateAssets());
    dispatch(loadAccountOpenOrders({ marketId: log.marketId }));
    dispatch(loadAccountPositionsTotals());
  }
  if (isCurrentMarket(log.marketId))
    dispatch(loadMarketOpenOrders(log.marketId));
};

export const handleOrderFilledLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfo([log.marketId]));
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.filler === address || log.creator === address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    handlePendingOrder(log, dispatch, getState);
    handleAlertUpdate(log, dispatch, getState);
    dispatch(
      updateOutcomePrice(
        log.marketId,
        log.outcome,
        new BigNumber(log.price, 10)
      )
    );
    dispatch(loadUserMarketTradingHistory({ marketId: log.marketId }));
    dispatch(loadAccountOpenOrders({ marketId: log.marketId }));
  }
  // always reload account positions on trade so we get up to date PL data.
  dispatch(loadUserPositionsAndBalances(log.marketId));
  dispatch(loadMarketTradingHistory({ marketId: log.marketId }));
  if (isCurrentMarket(log.marketId))
    dispatch(loadMarketOpenOrders(log.marketId));
};

export const handleTradingProceedsClaimedLog = log => (dispatch, getState) => {
  const isStoredTransaction = log.sender === getState().loginAccount.address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(updateLoggedTransactions(log));
    dispatch(loadUserPositionsAndBalances(log.market));
  }
  if (isCurrentMarket(log.market)) dispatch(loadMarketOpenOrders(log.market));
};

export const handleInitialReportSubmittedLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadMarketsDisputeInfo([log.market]));
  dispatch(loadUnclaimedFees([log.market]));
  dispatch(loadReporting([log.market]));
  const isStoredTransaction = log.reporter === getState().loginAccount.address;
  if (isStoredTransaction) {
    handleAlertUpdate(log, dispatch, getState);
    dispatch(updateAssets());
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
};

export const handleInitialReporterRedeemedLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadUnclaimedFees([log.market]));
  const isStoredTransaction = log.reporter === getState().loginAccount.address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(loadReporting([log.market]));
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
  dispatch(getReportingFees());
};

export const handleMarketFinalizedLog = log => (dispatch, getState) =>
  dispatch(
    loadMarketsInfo([log.market], err => {
      if (err) return console.error(err);
      const { author } = getState().marketsData[log.market];
      dispatch(loadReporting([log.market]));
      dispatch(getWinningBalance([log.market]));
      const isOwnMarket = getState().loginAccount.address === author;
      if (isOwnMarket) {
        dispatch(updateAssets());
        dispatch(updateLoggedTransactions(log));
      }
      if (!log.removed) {
        const { alerts } = getState();
        const doesntExist =
          !alerts.filter(
            alert =>
              alert.id === log.transactionHash &&
              alert.params.type === "finalize"
          ).length > 0;

        if (doesntExist && isOwnMarket) {
          // Trigger the alert addition here because calling other
          // API functions, such as `InitialReporter.redeem` can indirectly
          // cause a MarketFinalized event to be logged.
          dispatch(
            addAlert({
              id: `${log.transactionHash}_finalize`,
              timestamp: log.timestamp,
              blockNumber: log.blockNumber,
              log,
              params: {
                type: "finalize"
              },
              status: "Confirmed",
              linkPath: makePath(MY_MARKETS)
            })
          );
        } else if (!doesntExist) {
          handleAlertUpdate(log, dispatch, getState);
        }
      }
    })
  );

export const handleDisputeCrowdsourcerCreatedLog = log => dispatch => {
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
};

export const handleDisputeCrowdsourcerContributionLog = log => (
  dispatch,
  getState
) => {
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(defaultLogHandler(log));
  if (log.reporter === getState().loginAccount.address) {
    dispatch(updateAssets());
    dispatch(loadReportingWindowBounds());
  }
};

export const handleDisputeCrowdsourcerCompletedLog = log => dispatch => {
  dispatch(loadMarketsInfo([log.marketId]));
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
};

export const handleDisputeCrowdsourcerRedeemedLog = log => dispatch => {
  dispatch(loadMarketsDisputeInfo([log.marketId]));
  dispatch(loadReportingWindowBounds());
  dispatch(defaultLogHandler(log));
  dispatch(getReportingFees());
};

export const handleFeeWindowCreatedLog = log => dispatch => {
  dispatch(loadReportingWindowBounds());
  dispatch(getReportingFees());
};

export const handleFeeWindowOpenedLog = log => dispatch => {
  dispatch(loadReportingWindowBounds());
  dispatch(getReportingFees());
};

export const handleFeeWindowRedeemedLog = log => dispatch => {
  dispatch(defaultLogHandler(log));
  dispatch(getReportingFees());
};

export const handleCompleteSetsSoldLog = log => (dispatch, getState) => {
  const isStoredTransaction = log.account === getState().loginAccount.address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(updateLoggedTransactions(log));
    dispatch(loadUserPositionsAndBalances(log.marketId));
  }
};

export const handleApprovalLog = log => (dispatch, getState) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.owner === address;
  if (isStoredTransaction) {
    dispatch(
      updateAlert(log.transactionHash, {
        id: log.transactionHash,
        status: "Confirmed",
        timestamp: selectCurrentTimestampInSeconds(getState())
      })
    );
  }
};
