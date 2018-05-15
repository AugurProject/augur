import { connect } from 'react-redux'

import PerformanceGraph from 'modules/portfolio/components/performance-graph/performance-graph'
import getProfitLoss from 'modules/portfolio/actions/get-profit-loss'

const mapStateToProps = state => ({
  universe: state.universe.id,
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
})

const mapDispatchToProps = dispatch => ({
  getProfitLoss: (universe, startTime, endTime, periodInterval, callback) => dispatch(getProfitLoss(universe, startTime, endTime, periodInterval, callback)),
})

const PerformanceGraphContainer = connect(mapStateToProps, mapDispatchToProps)(PerformanceGraph)

export default PerformanceGraphContainer
