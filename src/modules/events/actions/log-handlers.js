import BigNumber from "bignumber.js";
import {
  addNotification,
  updateNotification
} from "modules/notifications/actions/notifications";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import loadBidsAsks from "modules/orders/actions/load-bids-asks";
import { loadReportingWindowBounds } from "modules/reports/actions/load-reporting-window-bounds";
import { updateLoggedTransactions } from "modules/transactions/actions/convert-logs-to-transactions";
import { removeMarket } from "modules/markets/actions/update-markets-data";
import { updateOutcomePrice } from "modules/markets/actions/update-outcome-price";
import { updateOrder } from "modules/orders/actions/update-orders";
import { removeCanceledOrder } from "modules/orders/actions/update-order-status";
import { updateMarketCategoryPopularity } from "modules/categories/actions/update-categories";
import { defaultLogHandler } from "modules/events/actions/default-log-handler";
import { isCurrentMarket } from "modules/trades/helpers/is-current-market";
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
import { loadFundingHistory } from "modules/account/actions/load-funding-history";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import { startOrderSending } from "modules/orders/actions/liquidity-management";
import { loadMarketTradingHistory } from "modules/markets/actions/market-trading-history-management";
import { updateAssets } from "modules/auth/actions/update-assets";
import { selectCurrentTimestampInSeconds } from "src/select-state";

const handleNotificationUpdate = (log, dispatch, getState) => {
  dispatch(
    updateNotification(log.transactionHash, {
      id: log.transactionHash,
      timestamp: selectCurrentTimestampInSeconds(getState()),
      blockNumber: log.blockNumber,
      log,
      status: "Confirmed",
      linkPath: makePath(TRANSACTIONS),
      seen: false // Manually set to false to ensure notification
    })
  );
};

export const handleMarketStateLog = log => dispatch => {
  dispatch(
    loadMarketsInfo([log.marketId], () => {
      dispatch(loadReporting());
    })
  );
};

export const handleMarketCreatedLog = log => (dispatch, getState) => {
  const isStoredTransaction =
    log.marketCreator === getState().loginAccount.address;
  if (log.removed) {
    dispatch(removeMarket(log.market));
  } else {
    dispatch(loadMarketsInfo([log.market]));
    dispatch(loadCategories());
  }
  if (isStoredTransaction) {
    handleNotificationUpdate(log, dispatch, getState);
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
    dispatch(loadFundingHistory());
    dispatch(loadReportingWindowBounds());
    handleNotificationUpdate(log, dispatch, getState);
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
    handleNotificationUpdate(log, dispatch, getState);
  }
};

export const handleOrderCreatedLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfoIfNotLoaded([log.marketId]));
  const isStoredTransaction =
    log.orderCreator === getState().loginAccount.address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(updateOrder(log, true));
    handleNotificationUpdate(log, dispatch, getState);
    dispatch(loadAccountTrades({ marketId: log.marketId }));
  }
  if (isCurrentMarket(log.marketId)) dispatch(loadBidsAsks(log.marketId));
};

export const handleOrderCanceledLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfoIfNotLoaded([log.marketId]));
  const isStoredTransaction = log.sender === getState().loginAccount.address;
  if (isStoredTransaction) {
    if (!log.removed) dispatch(removeCanceledOrder(log.orderId));
    handleNotificationUpdate(log, dispatch, getState);
    dispatch(updateAssets());
    dispatch(updateOrder(log, false));
    dispatch(loadAccountTrades({ marketId: log.marketId }));
  }
  if (isCurrentMarket(log.marketId)) dispatch(loadBidsAsks(log.marketId));
};

export const handleOrderFilledLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfo([log.marketId]));
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.filler === address || log.creator === address;
  const popularity = log.removed
    ? new BigNumber(log.amount, 10).negated().toFixed()
    : log.amount;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(
      updateOutcomePrice(
        log.marketId,
        log.outcome,
        new BigNumber(log.price, 10)
      )
    );
    dispatch(updateMarketCategoryPopularity(log.market, popularity));
    dispatch(updateOrder(log, false));
    handleNotificationUpdate(log, dispatch, getState);
  }
  // always reload account positions on trade so we get up to date PL data.
  dispatch(loadAccountTrades({ marketId: log.marketId }));
  dispatch(loadMarketTradingHistory({ marketId: log.marketId }));
  if (isCurrentMarket(log.marketId)) dispatch(loadBidsAsks(log.marketId));
};

export const handleTradingProceedsClaimedLog = log => (dispatch, getState) => {
  const isStoredTransaction = log.sender === getState().loginAccount.address;
  if (isStoredTransaction) {
    dispatch(updateAssets());
    dispatch(updateLoggedTransactions(log));
    dispatch(loadAccountTrades({ marketId: log.market }));
    dispatch(getWinningBalance([log.market]));
  }
  if (isCurrentMarket(log.market)) dispatch(loadBidsAsks(log.market));
};

export const handleInitialReportSubmittedLog = log => (dispatch, getState) => {
  dispatch(loadMarketsInfo([log.market]));
  dispatch(loadMarketsDisputeInfo([log.market]));
  dispatch(loadUnclaimedFees([log.market]));
  dispatch(loadReporting());
  const isStoredTransaction = log.reporter === getState().loginAccount.address;
  if (isStoredTransaction) {
    handleNotificationUpdate(log, dispatch, getState);
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
    dispatch(loadReporting());
    dispatch(loadDisputing());
    dispatch(updateLoggedTransactions(log));
  }
  dispatch(getReportingFees());
};

export const handleMarketFinalizedLog = log => (dispatch, getState) =>
  dispatch(
    loadMarketsInfo([log.market], err => {
      if (err) return console.error(err);
      const { volume, author } = getState().marketsData[log.market];
      dispatch(
        updateMarketCategoryPopularity(
          log.market,
          new BigNumber(volume, 10).negated().toFixed()
        )
      );
      dispatch(loadReporting());
      dispatch(getWinningBalance([log.market]));
      const isOwnMarket = getState().loginAccount.address === author;
      if (isOwnMarket) {
        dispatch(updateAssets());
        dispatch(updateLoggedTransactions(log));
      }
      if (!log.removed) {
        const { notifications } = getState();
        const doesntExist =
          !notifications.filter(
            notification =>
              notification.id === log.transactionHash &&
              notification.params.type === "finalize"
          ).length > 0;

        if (doesntExist && isOwnMarket) {
          // Trigger the notification addition here because calling other
          // API functions, such as `InitialReporter.redeem` can indirectly
          // cause a MarketFinalized event to be logged.
          dispatch(
            addNotification({
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
          handleNotificationUpdate(log, dispatch, getState);
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
    // always reload account positions on trade so we get up to date PL data.
    dispatch(loadAccountTrades({ marketId: log.marketId }));
  }
};

export const handleApprovalLog = log => (dispatch, getState) => {
  const { address } = getState().loginAccount;
  const isStoredTransaction = log.owner === address;
  if (isStoredTransaction) {
    dispatch(
      updateNotification(log.transactionHash, {
        id: log.transactionHash,
        status: "Confirmed",
        timestamp: selectCurrentTimestampInSeconds(getState())
      })
    );
  }
};
