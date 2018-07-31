import selectOrder from 'modules/bids-asks/selectors/select-order'

export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS'
export const UPDATE_ORDER_REMOVE = 'UPDATE_ORDER_REMOVE'
/**
 *
 * @param {String} orderId
 * @param {String} status
 * @param {String} marketId
 * @param outcome
 * @param {String} orderTypeLabel
 */
export const updateOrderStatus = (orderId, status, marketId, outcome, orderTypeLabel) => (dispatch, getState) => {
  const { orderBooks } = getState()
  const order = selectOrder(orderId, marketId, outcome, orderTypeLabel, orderBooks)
  if (order == null) {
    return warnNonExistingOrder(orderId, status, marketId, outcome, orderTypeLabel)
  }
  dispatch({
    type: UPDATE_ORDER_STATUS,
    orderId,
    status,
    marketId,
    orderType: orderTypeLabel,
  })
}

export const removeCanceledOrder = orderId => dispatch => dispatch({ type: UPDATE_ORDER_REMOVE, orderId })

function warnNonExistingOrder(orderId, status, marketId, outcome, orderTypeLabel) {
  return console.warn('updateOrderStatus: can\'t update %o', orderId, status, marketId, outcome, orderTypeLabel)
}
