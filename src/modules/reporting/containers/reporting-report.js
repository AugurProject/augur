import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingReport from 'modules/reporting/components/reporting-report/reporting-report'
import { loadFullMarket } from 'modules/market/actions/load-full-market'
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'
import { selectMarket } from 'modules/market/selectors/market'
import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  isConnected: state.connection.isConnected,
  universe: state.universe,
  marketsData: state.marketsData,
  isMobile: state.isMobile
})

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
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
    loadFullMarket: () => dP.loadFullMarket(marketId)
  }
}

const Reporting = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingReport))

export default Reporting
