import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import { createBigNumber } from 'utils/create-big-number'

import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'

import orderAndAssignCumulativeShares from 'modules/market/helpers/order-and-assign-cumulative-shares'
import orderForMarketDepth from 'modules/market/helpers/order-for-market-depth'
import getOrderBookKeys from 'modules/market/helpers/get-orderbook-keys'

import { selectMarket } from 'modules/market/selectors/market'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

// Mock priceTimeSeries Data
// const now = Date.now()
// const timeDiff = (now - new Date(2017, 8).getTime()) // Can tweak this for more range
// const startTime = now - timeDiff
// const priceTimeSeries = [...new Array(1000000)].map((value, i, array) => ({
//   timestamp: Number((startTime + (i * (timeDiff / array.length))).toFixed(0)),
//   price: (Math.random().toPrecision(15)).toString(),
//   amount: (((Math.random() * (10 - 1)) + 1).toPrecision(15)).toString(),
// }))

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)
  const minPrice = market.minPrice || createBigNumber(0)
  const maxPrice = market.maxPrice || createBigNumber(0)
  const outcome = (market.outcomes || []).find(outcome => outcome.id === ownProps.selectedOutcome) || {}
  const priceTimeSeries = outcome.priceTimeSeries || []
  const cumulativeOrderBook = orderAndAssignCumulativeShares(outcome.orderBook)
  const marketDepth = orderForMarketDepth(cumulativeOrderBook)
  const orderBookKeys = getOrderBookKeys(marketDepth, minPrice, maxPrice)
  return {
    outcomeName: outcome.name,
    isMobile: state.isMobile,
    currentBlock: state.blockchain.currentBlockNumber || 0,
    orderBook: cumulativeOrderBook,
    hasPriceHistory: priceTimeSeries.length !== 0,
    hasOrders: !isEmpty(cumulativeOrderBook[BIDS]) && !isEmpty(cumulativeOrderBook[ASKS]),
    priceTimeSeries,
    marketDepth,
    orderBookKeys,
    minPrice,
    maxPrice,
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)
