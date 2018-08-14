import { connect } from 'react-redux'

import MarketBasics from 'modules/market/components/market-basics/market-basics'
import { selectMarketOutcomeTradingStatus } from 'modules/market/selectors/select-market-outcome-trading-status'
import { selectCurrentTimestamp } from 'src/select-state'

const mapStateToProps = state => ({
  currentTimestamp: selectCurrentTimestamp(state),
  isMobile: state.isMobile,
})

const mergeProps = (sP, dP, oP) => {

  const outcomeStatuses = selectMarketOutcomeTradingStatus(oP.id, oP.outcomes)

  return {
    outcomeStatuses,
    ...oP,
    ...dP,
    ...sP,
  }
}

const MarketBasicsContainer = connect(mapStateToProps, null, mergeProps)(MarketBasics)

export default MarketBasicsContainer
