import { augur } from 'services/augurjs'
import { updateIsFirstOrderBookChunkLoaded } from 'modules/bids-asks/actions/update-order-book'
import insertOrderBookChunkToOrderBook from 'modules/bids-asks/actions/insert-order-book-chunk-to-order-book'
import logError from 'utils/log-error'

import { has } from 'lodash'

const loadOneOutcomeBidsOrAsks = (marketId, outcome, orderTypeLabel, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState()
  if (marketId == null || outcome == null || orderTypeLabel == null) {
    return callback(`must specify market ID, outcome, and order type: ${marketId} ${outcome} ${orderTypeLabel}`)
  }
  const market = marketsData[marketId]
  if (!market) return callback(`market ${marketId} data not found`)
  dispatch(updateIsFirstOrderBookChunkLoaded(marketId, outcome, orderTypeLabel, false))
  augur.trading.getOrders({ marketId, outcome, orderType: orderTypeLabel, orderState: augur.constants.ORDER_STATE.OPEN }, (err, orders) => {
    if (err) return callback(err)
    if (orders != null) {
      dispatch(insertOrderBookChunkToOrderBook(marketId, outcome, orderTypeLabel, has(orders, [marketId, outcome, orderTypeLabel]) ? orders[marketId][outcome][orderTypeLabel] : {}))
    }
    callback(null)
  })
}

export default loadOneOutcomeBidsOrAsks
