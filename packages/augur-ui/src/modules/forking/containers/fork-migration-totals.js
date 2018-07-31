import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { selectMarket } from 'modules/market/selectors/market'

import ForkMigrationTotalsView from 'modules/forking/components/fork-migration-totals/fork-migration-totals'

import { getForkMigrationTotals } from 'modules/forking/actions/get-fork-migration-totals'

const mapStateToProps = state => ({
  universe: state.universe.id,
  forkingMarketId: state.universe.forkingMarket,
  currentBlockNumber: state.blockchain.currentBlockNumber,
})

const mapDispatchToProps = dispatch => ({
  getForkMigrationTotals: (universe, callback) => dispatch(getForkMigrationTotals(universe, callback)),
})

const mergeProps = (sP, dP) => {

  const forkingMarket = selectMarket(sP.forkingMarketId)

  return {
    ...sP,
    forkingMarket,
    getForkMigrationTotals: callback => dP.getForkMigrationTotals(sP.universe, callback),
  }
}

const ForkMigrationTotals = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ForkMigrationTotalsView))

export default ForkMigrationTotals
