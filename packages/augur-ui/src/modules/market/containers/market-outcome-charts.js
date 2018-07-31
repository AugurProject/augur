import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import { createBigNumber } from 'utils/create-big-number'

import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'

import orderAndAssignCumulativeShares from 'modules/market/helpers/order-and-assign-cumulative-shares'
import orderForMarketDepth from 'modules/market/helpers/order-for-market-depth'
import getOrderBookKeys from 'modules/market/helpers/get-orderbook-keys'

import { selectMarket } from 'modules/market/selectors/market'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'
import { selectCurrentTimestampInSeconds } from 'src/select-state'

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
    selectedOutcome: outcome,
    isMobile: state.isMobile,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: cumulativeOrderBook,
    hasPriceHistory: priceTimeSeries.length !== 0,
    hasOrders: !isEmpty(cumulativeOrderBook[BIDS]) || !isEmpty(cumulativeOrderBook[ASKS]),
    priceTimeSeries,
    marketDepth,
    orderBookKeys,
    minPrice,
    maxPrice,
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)
