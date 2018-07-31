import { augur } from 'services/augurjs'
import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PENDING } from 'modules/market/constants/close-dialog-status'
import { updateOrderStatus } from 'modules/bids-asks/actions/update-order-status'
import selectOrder from 'modules/bids-asks/selectors/select-order'
import logError from 'utils/log-error'

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000

export const cancelOrder = (orderId, marketId, outcome, orderTypeLabel, callback = logError) => (dispatch, getState) => {
  const {
    loginAccount, orderBooks, outcomesData, marketsData,
  } = getState()
  const order = selectOrder(orderId, marketId, outcome, orderTypeLabel, orderBooks)
  const market = marketsData[marketId]
  if (order && market && outcomesData[marketId] && outcomesData[marketId][outcome]) {
    augur.api.CancelOrder.cancelOrder({
      meta: loginAccount.meta,
      _orderId: orderId,
      onSent: () => dispatch(updateOrderStatus(orderId, CLOSE_DIALOG_PENDING, marketId, outcome, orderTypeLabel)),
      onSuccess: () => {
        dispatch(updateOrderStatus(orderId, CLOSE_DIALOG_CLOSING, marketId, outcome, orderTypeLabel))
        callback(null)
      },
      onFailed: (err) => {
        dispatch(updateOrderStatus(orderId, CLOSE_DIALOG_FAILED, marketId, outcome, orderTypeLabel))
        setTimeout(() => dispatch(updateOrderStatus(orderId, null, marketId, outcome, orderTypeLabel)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS)
        callback(err)
      },
    })
  }
}
