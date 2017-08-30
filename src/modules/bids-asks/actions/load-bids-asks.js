import { augur } from 'services/augurjs'
import { SCALAR } from 'modules/markets/constants/market-types'
import { clearMarketOrderBook, updateMarketOrderBook } from 'modules/bids-asks/actions/update-market-order-book'
import logError from 'utils/log-error'

export const loadBidsAsks = (marketID, callback = logError) => (dispatch, getState) => {
  const market = getState().marketsData[marketID]
  const scalarMinMax = {}
  if (market.type === SCALAR) {
    scalarMinMax.minValue = market.minValue
    scalarMinMax.maxValue = market.maxValue
  }
  let firstChunkLoaded
  augur.trading.orderBook.getOrderBookChunked({
    marketID,
    offset: 0,
    numTradesToLoad: null,
    scalarMinMax,
    totalTrades: null
  }, (orderBookChunk) => {
    console.log('order book chunk:', marketID, orderBookChunk)
    if (!firstChunkLoaded) {
      firstChunkLoaded = true
      console.log('first chunk, clearing order book...')
      dispatch(clearMarketOrderBook(marketID))
    }
    dispatch(updateMarketOrderBook(marketID, orderBookChunk))
  }, callback)
}
