import { connect } from 'react-redux'

import MarketOutcomesChart from 'modules/market/components/market-outcomes-chart/market-outcomes-chart'

import { selectMarket } from 'modules/market/selectors/market'
import { selectCurrentTimestamp } from 'src/select-state'
import { createBigNumber } from 'src/utils/create-big-number'

const mapStateToProps = (state, ownProps) => {
  const {
    creationTime = {},
    maxPrice = createBigNumber(1),
    minPrice = createBigNumber(0),
    outcomes = [],
  } = selectMarket(ownProps.marketId)

  const estimatedInitialPrice = outcomes.length > 0 ? (1 / outcomes.length): 0

  return {
    creationTime: creationTime.value.getTime(),
    currentTimestamp: selectCurrentTimestamp(state),
    estimatedInitialPrice,
    maxPrice: maxPrice.toNumber(),
    minPrice: minPrice.toNumber(),
    outcomes,
  }
}

export default connect(mapStateToProps)(MarketOutcomesChart)
