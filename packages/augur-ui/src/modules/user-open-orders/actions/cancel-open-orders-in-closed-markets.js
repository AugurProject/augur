import { cancelOrder } from 'modules/bids-asks/actions/cancel-order'

const cancelOpenOrdersInClosedMarkets = () => (dispatch) => {
  const openOrders = require('modules/user-open-orders/selectors/open-orders')
  if (openOrders && openOrders.length) {
    const numMarketsWithOpenOrders = openOrders.length
    for (let i = 0; i < numMarketsWithOpenOrders; ++i) {
      const market = openOrders[i]
      if (!market.isOpen) {
        const numOutcomes = market.outcomes.length
        for (let j = 0; j < numOutcomes; ++j) {
          const outcome = market.outcomes[j]
          const numOrders = outcome.userOpenOrders.length
          if (numOrders) {
            console.log('found open orders:', outcome.id, outcome.userOpenOrders)
            for (let k = 0; k < numOrders; ++k) {
              const openOrder = outcome.userOpenOrders[k]
              console.log('cancelling order:', cancelOrder, openOrder.id, market.id, outcome.id, openOrder.type)
              dispatch(cancelOrder(openOrder.id, market.id, outcome.id, openOrder.type))
            }
          }
        }
      }
    }
  }
}

export default cancelOpenOrdersInClosedMarkets
