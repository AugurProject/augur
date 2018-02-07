import { augur } from 'services/augurjs'
import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED } from 'modules/market/constants/close-dialog-status'
import { updateOrderStatus } from 'modules/bids-asks/actions/update-order-status'
import selectOrder from 'modules/bids-asks/selectors/select-order'
import noop from 'utils/noop'
import logError from 'utils/log-error'

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000

export const cancelOrder = (orderID, marketID, outcome, orderTypeLabel, callback = logError) => (dispatch, getState) => {
  const {
    loginAccount, orderBooks, outcomesData, marketsData
  } = getState()
  const order = selectOrder(orderID, marketID, outcome, orderTypeLabel, orderBooks)
  const market = marketsData[marketID]
  if (order && market && outcomesData[marketID] && outcomesData[marketID][outcome]) {
    dispatch(updateOrderStatus(orderID, CLOSE_DIALOG_CLOSING, marketID, outcome, orderTypeLabel))
    augur.api.CancelOrder.cancelOrder({
      meta: loginAccount.meta,
      _orderId: orderID,
      onSent: noop,
      onSuccess: () => {
        // TODO: do we need to update anything or will the update come in on emitter
        callback(null)
      },
      onFailed: (err) => {
        dispatch(updateOrderStatus(orderID, CLOSE_DIALOG_FAILED, marketID, outcome, orderTypeLabel))
        setTimeout(() => dispatch(updateOrderStatus(orderID, null, marketID, outcome, orderTypeLabel)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS)
        callback(err)
      }
    })
  }
}
