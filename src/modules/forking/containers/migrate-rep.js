import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MigrateRepView from 'modules/forking/components/migrate-rep/migrate-rep'
import { loadFullMarket } from 'modules/market/actions/load-full-market'
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'
import { selectMarket } from 'modules/market/selectors/market'
import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'

import { submitMigrateREP } from 'modules/forking/actions/submit-migrate-rep'
import { estimateSubmitMigrateREP } from 'modules/forking/actions/estimate-submit-migrate-rep'
import { getForkMigrationTotals } from 'modules/forking/actions/get-fork-migration-totals'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  isConnected: state.connection.isConnected,
  universe: state.universe.id,
  marketsData: state.marketsData,
  isMobile: state.isMobile,
  accountREP: state.loginAccount.rep,
})

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  submitMigrateREP: (marketId, outcomeValue, invalid, amount, history) => dispatch(submitMigrateREP(marketId, outcomeValue, invalid, amount, history)),
  estimateSubmitMigrateREP: (marketId, outcomeValue, invalid, amount, history) => dispatch(estimateSubmitMigrateREP(marketId, outcomeValue, invalid, amount, history)),
  getForkMigrationTotals: (universe, callback) => dispatch(getForkMigrationTotals(universe, callback)),
})


const mergeProps = (sP, dP, oP) => {
  const marketId = parseQuery(oP.location.search)[MARKET_ID_PARAM_NAME]
  const market = selectMarket(marketId)

  return {
    ...oP,
    ...sP,
    marketId,
    isLogged: sP.isLogged,
    isConnected: sP.isConnected && getValue(sP, 'universe.id') != null,
    isMarketLoaded: sP.marketsData[marketId] != null,
    market,
    loadFullMarket: () => dP.loadFullMarket(marketId),
    submitMigrateREP: (marketId, selectedOutcome, invalid, amount, history) => dP.submitMigrateREP(marketId, selectedOutcome, invalid, amount, history),
    estimateSubmitMigrateREP: (marketId, selectedOutcome, invalid, amount, history) => dP.estimateSubmitMigrateREP(marketId, selectedOutcome, invalid, amount, history),
    getForkMigrationTotals: callback => dP.getForkMigrationTotals(sP.universe, callback),
  }
}

const MigrateRep = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MigrateRepView))

export default MigrateRep
