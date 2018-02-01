import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketOutcomesAndPositions from 'modules/market/components/market-outcomes-and-positions/market-outcomes-and-positions'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import { selectMarket } from 'modules/market/selectors/market'
// import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  scalarShareDenomination: getScalarShareDenomination(),
  isMobile: state.isMobile,
})

const mergeProps = (sP, dP, oP) => {
  const market = selectMarket(oP.marketId)

  console.log('market -- ', market)
  let openOrders = []
  let positions = []
  if (market && market.outcomes && market.outcomes.length > 0) {
    openOrders = market.outcomes[0].userOpenOrders ? market.outcomes[0].userOpenOrders : []
    positions = market.outcomes[0].positions ? market.outcomes[0].positions : []
  }
  return {
    ...sP,
    ...oP,
    outcomes: market.outcomes,
    openOrders,
    positions
    // TODO -- need to rethink best shape for `userOpenOrders`
    // openOrder: getValue(market, 'outcomes')
  }
}

const MarketOutcomesAndPositionsContainer = withRouter(connect(mapStateToProps, null, mergeProps)(MarketOutcomesAndPositions))

export default MarketOutcomesAndPositionsContainer
