// import { addOrder, removeOrder } from 'modules/bids-asks/actions/update-order-book';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

import { CANCEL_ORDER } from 'modules/transactions/constants/types'

export function updateOrders(data, isAddition) {
  return (dispatch, getState) => {
    Object.keys(data).forEach((market) => {
      const isMarketInfoLoaded = getState().marketsData[market]
      if (isMarketInfoLoaded) {
        dispatchOrderUpdates(data[market], isAddition, dispatch, getState)
      } else {
        dispatch(loadMarketsInfo([market], () => {
          dispatchOrderUpdates(data[market], isAddition, dispatch, getState)
        }))
      }
    })
  }
}

function dispatchOrderUpdates(marketOrderData, isAddition, dispatch, getState) {
  Object.keys(marketOrderData).forEach((outcome) => {
    marketOrderData[outcome].forEach((orderLog) => {
      const { transactionsData } = getState()
      const cancelledOrder = Object.keys(transactionsData).find(id => transactionsData[id].orderId === orderLog.orderId && transactionsData[id].type === CANCEL_ORDER)
      if (isAddition && !cancelledOrder) {
        // dispatch(addOrder(orderLog));
      } else {
        // dispatch(removeOrder(orderLog));
      }
    })
  })
}
