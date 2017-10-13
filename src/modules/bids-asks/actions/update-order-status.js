import selectOrder from 'modules/bids-asks/selectors/select-order'

export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS'

/**
 *
 * @param {String} orderID
 * @param {String} status
 * @param {String} marketID
 * @param {String} orderTypeLabel
 */
export const updateOrderStatus = (orderID, status, marketID, outcome, orderTypeLabel) => (dispatch, getState) => {
  const { orderBooks } = getState()
  const order = selectOrder(orderID, marketID, outcome, orderTypeLabel, orderBooks)
  if (order == null) {
    return warnNonExistingOrder(orderID, status, marketID, outcome, orderTypeLabel)
  }
  dispatch({
    type: UPDATE_ORDER_STATUS,
    orderID,
    status,
    marketID,
    orderType: orderTypeLabel
  })
}

function warnNonExistingOrder(orderID, status, marketID, outcome, orderTypeLabel) {
  return console.warn('updateOrderStatus: can\'t update %o', orderID, status, marketID, outcome, orderTypeLabel)
}
