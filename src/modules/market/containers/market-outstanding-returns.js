import { connect } from 'react-redux'

import MarketOutstandingReturns from 'modules/market/components/market-outstanding-returns/market-outstanding-returns'

const mapStateToProps = state => {
  // Will need to add a selector or somehting to actually get this info
  return {
    outstandingReturns: {
      value: 12.54,
      formattedValue: 12.54,
      formatted: '12.54',
      roundedValue: 12.54,
      rounded: '12.54',
      minimized: '12.54',
      denomination: ' ETH',
      full: '12.54 ETH'
    }
  }
}

const MarketOutstandingReturnsContainer = connect(mapStateToProps)(MarketOutstandingReturns)

export default MarketOutstandingReturnsContainer
