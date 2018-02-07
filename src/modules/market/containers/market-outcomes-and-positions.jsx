import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketOutcomesAndPositions from 'modules/market/components/market-outcomes-and-positions/market-outcomes-and-positions'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import { selectMarket } from 'modules/market/selectors/market'
import { sortOpenOrders } from 'modules/user-open-orders/selectors/open-orders'
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
    const newMarket = sortOpenOrders(market)
    openOrders = newMarket.outcomes.reduce((p, outcome) => {
      if (outcome.userOpenOrders && outcome.userOpenOrders.length > 0) {
        outcome.userOpenOrders.forEach(order => p.push(order))
      }
      return p
    }, [])
    positions = market.outcomes.reduce((p, outcome) => {
      if (outcome.position) {
        p.push(outcome.position)
      }
      return p
    }, [])
  }
  return {
    ...sP,
    ...oP,
    outcomes: market.outcomes,
    positions,
    openOrders,
  }
}

const MarketOutcomesAndPositionsContainer = withRouter(connect(mapStateToProps, null, mergeProps)(MarketOutcomesAndPositions))

export default MarketOutcomesAndPositionsContainer
