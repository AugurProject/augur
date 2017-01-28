import memorizerific from 'memoizerific';

import store from 'src/store';

import { clearClosePositionTradeGroup } from 'modules/my-positions/actions/clear-close-position-trade-group';

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/trade-close-status';

import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses';

export default () => {
  const { closePositionTradeGroups, transactionsData } = store.getState();

  return {
    ...selectClosePositionStatus(closePositionTradeGroups, transactionsData)
  };
};

const selectClosePositionStatus = memorizerific(5)((closePositionTradeGroups, transactionsData) => {
  const statuses = Object.keys(closePositionTradeGroups).reduce((p, marketID) => {
    const outcomeStatuses = Object.keys(closePositionTradeGroups[marketID]).reduce((p, outcomeID) => {
      const closePositionTransactionIDs = closePositionTradeGroups[marketID][outcomeID].reduce((p, tradeGroupID) => {
        const transactionIDs = Object.keys(transactionsData).filter(transactionHash => transactionsData[transactionHash].tradeGroupID === tradeGroupID);

        if (transactionIDs.length !== 0) {
          return [...p, ...transactionIDs];
        }

        return p;
      }, []);

      // Short Circuit until transactionsData is updated with the tradeGroupID
      if (closePositionTransactionIDs.length === 0 && closePositionTradeGroups[marketID][outcomeID]) {
        return { ...p, [outcomeID]: CLOSE_DIALOG_CLOSING };
      }

      const numberOfFailedTransactions = closePositionTransactionIDs.filter(transactionID => transactionsData[transactionID].status === FAILED).length;

      // Close Position Completely Failed
      if (numberOfFailedTransactions === closePositionTransactionIDs.length) {
        delayClearTradeGroupIDs(marketID, outcomeID);

        return { ...p, [outcomeID]: CLOSE_DIALOG_FAILED };
      }

      // Close Position Completely Succeeded
      const numberOfSuccessfulTransactions = closePositionTransactionIDs.filter(transactionID => transactionsData[transactionID].status === SUCCESS).length;

      if (numberOfSuccessfulTransactions === closePositionTransactionIDs.length) {
        delayClearTradeGroupIDs(marketID, outcomeID);

        return { ...p, [outcomeID]: CLOSE_DIALOG_SUCCESS };
      }

      // Close Position Partially Failed
      if (numberOfFailedTransactions) {
        return { ...p, [outcomeID]: CLOSE_DIALOG_PARTIALLY_FAILED };
      } else if (numberOfFailedTransactions && numberOfFailedTransactions + numberOfSuccessfulTransactions === closePositionTransactionIDs.length) {
        delayClearTradeGroupIDs(marketID, outcomeID);

        return { ...p, [outcomeID]: CLOSE_DIALOG_PARTIALLY_FAILED };
      }

      // Close Position In-Process without Failures
      return { ...p, [outcomeID]: CLOSE_DIALOG_CLOSING };
    }, {});

    if (Object.keys(outcomeStatuses).length !== 0) {
      return { ...p, [marketID]: outcomeStatuses };
    }

    return p;
  }, {});

  return statuses;
});

function delayClearTradeGroupIDs(marketID, outcomeID) {
  // waits, then clears tradeIDs from closePositionTradeGroups
  // This will ultimately clear the outcome status and allow for the user to try again if an action is available

  setTimeout(() => {
    store.dispatch(clearClosePositionTradeGroup(marketID, outcomeID));
  }, 3000);
}
