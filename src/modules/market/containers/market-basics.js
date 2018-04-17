import { connect } from 'react-redux'

import MarketBasics from 'modules/market/components/market-basics/market-basics'

import { selectCurrentTimestamp } from 'src/select-state'

const mapStateToProps = state => ({
  currentTimestamp: selectCurrentTimestamp(state),
  isMobile: state.isMobile,
})

const MarketBasicsContainer = connect(mapStateToProps)(MarketBasics)

export default MarketBasicsContainer
