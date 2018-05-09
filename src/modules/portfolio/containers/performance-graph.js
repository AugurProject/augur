import { connect } from 'react-redux'

import PerformanceGraph from 'modules/portfolio/components/performance-graph/performance-graph'
import getProfitLoss from 'modules/portfolio/actions/get-profit-loss'

const mapStateToProps = (state) => {
  // TODO: replace wit han actual selector to get the PL data
  const randomData = () => [...new Array(30)].map(() => [(new Date()).getTime() - (Math.random() * ((1000000000000 - 0) + 0)), (Math.random() * 1)]).sort((a, b) => a[0] - b[0])

  const newSeries = () => [{
    data: randomData(),
    name: 'Total',
    color: '#553580',
  }]

  const performanceData = {
    Realized: {
      day: newSeries(),
      week: newSeries(),
      month: newSeries(),
      all: newSeries(),
    },
    Unrealized: {
      day: newSeries(),
      week: newSeries(),
      month: newSeries(),
      all: newSeries(),
    },
    Total: {
      day: newSeries(),
      week: newSeries(),
      month: newSeries(),
      all: newSeries(),
    },
  }

  return {
    performanceData,
    universe: state.universe.id,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  }
}

const mapDispatchToProps = dispatch => ({
  getProfitLoss: (universe, startTime, endTime, periodInterval, callback) => dispatch(getProfitLoss(universe, startTime, endTime, periodInterval, callback)),
})

const PerformanceGraphContainer = connect(mapStateToProps, mapDispatchToProps)(PerformanceGraph)

export default PerformanceGraphContainer
