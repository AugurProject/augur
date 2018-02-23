import { updateOrderBook } from 'modules/bids-asks/actions/update-order-book'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

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
      const { orderBooks } = getState()
      const orderBook = orderBooks[orderLog.marketID]
      dispatch(updateOrderBook(orderLog.marketID, outcome, orderLog.orderType, orderBook))
    })
  })
}
