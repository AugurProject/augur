import { createSelector } from 'reselect'
import store from 'src/store'
import { selectClosePositionTradeGroupsState, selectTransactionsDataState } from 'src/select-state'
import { clearClosePositionOutcome } from 'modules/my-positions/actions/clear-close-position-outcome'
import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_NO_ORDERS, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status'
import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses'
import { removeClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group'

export default function () {
  return selectClosePositionStatus(store.getState())
}

export const selectClosePositionStatus = createSelector(
  selectClosePositionTradeGroupsState,
  selectTransactionsDataState,
  (closePositionTradeGroups, transactionsData) => {
    const statuses = Object.keys(closePositionTradeGroups).reduce((p, marketId) => {
      const outcomeStatuses = Object.keys(closePositionTradeGroups[marketId]).reduce((p, outcomeId) => {
        const closePositionTransactionIds = closePositionTradeGroups[marketId][outcomeId].reduce((p, tradeGroupId) => {
          const transactionIds = Object.keys(transactionsData).filter(transactionId => transactionsData[transactionId].tradeGroupId === tradeGroupId)

          if (transactionIds.length !== 0) {
            return [...p, ...transactionIds]
          }

          return p
        }, [])

        // closing failed further up in the call chain to close position
        if (closePositionTradeGroups[marketId][outcomeId][0] === CLOSE_DIALOG_FAILED) {
          delayClearTradeGroupIds(marketId, outcomeId)

          return { ...p, [outcomeId]: CLOSE_DIALOG_FAILED }
        }

        // no orders are available within the outcome's order book
        if (closePositionTradeGroups[marketId][outcomeId][0] === CLOSE_DIALOG_NO_ORDERS) {
          delayClearTradeGroupIds(marketId, outcomeId)

          return { ...p, [outcomeId]: CLOSE_DIALOG_NO_ORDERS }
        }

        // Short Circuit until transactionsData is updated with the tradeGroupId
        if (closePositionTransactionIds.length === 0 && closePositionTradeGroups[marketId][outcomeId]) {
          return { ...p, [outcomeId]: CLOSE_DIALOG_CLOSING }
        }

        const numberOfFailedTransactions = closePositionTransactionIds.filter(transactionId => transactionsData[transactionId].status === FAILED).length

        // Close Position Completely Failed
        if (numberOfFailedTransactions === closePositionTransactionIds.length) {
          delayClearTradeGroupIds(marketId, outcomeId)

          return { ...p, [outcomeId]: CLOSE_DIALOG_FAILED }
        }

        // Close Position Completely Succeeded
        const numberOfSuccessfulTransactions = closePositionTransactionIds.filter(transactionId => transactionsData[transactionId].status === SUCCESS).length

        if (numberOfSuccessfulTransactions === closePositionTransactionIds.length) {
          delayClearTradeGroupIds(marketId, outcomeId)

          return { ...p, [outcomeId]: CLOSE_DIALOG_SUCCESS }
        }

        // TODO: This selector needs to be refactored along with closePositionTradeGroups reducer, so that partial fills are known
        // Close Position Partially Failed
        if (numberOfFailedTransactions && numberOfFailedTransactions !== closePositionTransactionIds.length && numberOfSuccessfulTransactions === 0) {

          return { ...p, [outcomeId]: CLOSE_DIALOG_PARTIALLY_FAILED }
        } else if (numberOfFailedTransactions && numberOfFailedTransactions + numberOfSuccessfulTransactions === closePositionTransactionIds.length) {
          delayClearTradeGroupIds(marketId, outcomeId)

          return { ...p, [outcomeId]: CLOSE_DIALOG_PARTIALLY_FAILED }
        }

        // Close Position In-Process without Failures
        return { ...p, [outcomeId]: CLOSE_DIALOG_CLOSING }
      }, {})

      if (Object.keys(outcomeStatuses).length !== 0) {
        delayClearTradeGroupIds(marketId, Object.keys(outcomeStatuses)[0])
        return { ...p, [marketId]: outcomeStatuses }
      }

      return p
    }, {})

    return statuses
  },
)

// waits, then clears orderIds from closePositionTradeGroups
// This will ultimately clear the outcome status and allow for the
// user to try again if an action is available
function delayClearTradeGroupIds(marketId, outcomeId) {
  setTimeout(() => {
    store.dispatch(clearClosePositionOutcome(marketId, outcomeId))
    store.dispatch(removeClosePositionTradeGroup(marketId, outcomeId, CLOSE_DIALOG_NO_ORDERS))
  }, 3000)
}
