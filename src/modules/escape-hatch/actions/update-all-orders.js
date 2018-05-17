export const UPDATE_ALL_ORDERS_DATA = 'UPDATE_ALL_ORDERS_DATA'
export const UPDATE_ORDER_CLEAR_ESCROWED = 'UPDATE_ORDER_CLEAR_ESCROWED'

export const updateAllOrdersData = allOrdersData => ({ type: UPDATE_ALL_ORDERS_DATA, allOrdersData })
export const updateOrderClearEscrowed = orderId => ({ type: UPDATE_ORDER_CLEAR_ESCROWED, orderId })
