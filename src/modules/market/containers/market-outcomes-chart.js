import { connect } from 'react-redux'
import memoize from 'memoizee'

import MarketOutcomesChart from 'modules/market/components/market-outcomes-chart/market-outcomes-chart'

import { selectMarket } from 'modules/market/selectors/market'

// Mock priceTimeSeries Data
const generateRandomPriceTimeSeries = memoize((outcomeID) => {
  const now = Date.now()
  const timeDiff = (now - new Date(2017, 8).getTime()) // Can tweak this for more range
  const startTime = now - timeDiff

  return [...new Array(1000)].map((value, i, array) => ({
    timestamp: Number((startTime + (i * (timeDiff / array.length))).toFixed(0)),
    price: (Math.random().toPrecision(15)).toString(),
    amount: (((Math.random() * (10 - 1)) + 1).toPrecision(15)).toString(),
  }))
}, { max: 8 })
const getOutcomesWithMockPriceTimeSeries = outcomes => outcomes.map(outcome => ({
  ...outcome,
  priceTimeSeries: generateRandomPriceTimeSeries(outcome.id),
}))

const mapStateToProps = (state, ownProps) => ({
  // outcomes: selectMarket(ownProps.marketId).outcomes || [],
  outcomes: getOutcomesWithMockPriceTimeSeries(selectMarket(ownProps.marketId).outcomes || []), // Mock priceTimeSeries
})

export default connect(mapStateToProps)(MarketOutcomesChart)
