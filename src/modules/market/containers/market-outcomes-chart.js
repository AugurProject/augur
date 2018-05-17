import { connect } from 'react-redux'

import MarketOutcomesChart from 'modules/market/components/market-outcomes-chart/market-outcomes-chart'

import { selectMarket } from 'modules/market/selectors/market'
import { selectCurrentTimestamp } from 'src/select-state'

const mapStateToProps = (state, ownProps) => {
  const {
    creationTime = {},
    outcomes = [],
  } = selectMarket(ownProps.marketId)

  const estimatedInitialPrice = outcomes.length > 0 ? (1 / outcomes.length): 0

  return {
    creationTime: creationTime.value.getTime(),
    currentTimestamp: selectCurrentTimestamp(state),
    estimatedInitialPrice,
    outcomes,
  }
}

export default connect(mapStateToProps)(MarketOutcomesChart)
