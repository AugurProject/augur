import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingReport from 'modules/reporting/components/reporting-report/reporting-report'
import { loadFullMarket } from 'modules/market/actions/load-full-market'
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'
import { selectMarket } from 'modules/market/selectors/market'
import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'
import { submitInitialReport } from 'modules/reporting/actions/submit-initial-report'
import { constants } from 'services/augurjs'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  // might need to call get market cost breakdown, it's on market from augur-node
  isConnected: state.connection.isConnected,
  universe: state.universe.id,
  marketsData: state.marketsData,
  isMobile: state.isMobile,
  availableRep: getValue(state, 'loginAccount.rep') || '0',
  userAddress: state.loginAccount.address,
})

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  submitInitialReport: (estimateGas, marketId, outcomeValue, invalid, history, callback) => dispatch(submitInitialReport(estimateGas, marketId, outcomeValue, invalid, history, callback)),
})


const mergeProps = (sP, dP, oP) => {
  const marketId = parseQuery(oP.location.search)[MARKET_ID_PARAM_NAME]
  const market = selectMarket(marketId)
  const isOpenReporting = market.reportingState === constants.REPORTING_STATE.OPEN_REPORTING
  const isDesignatedReporter = market.designatedReporter === sP.userAddress
  return {
    ...oP,
    ...sP,
    marketId,
    isOpenReporting,
    isDesignatedReporter,
    isLogged: sP.isLogged,
    isConnected: sP.isConnected && getValue(sP, 'universe.id') != null,
    isMarketLoaded: sP.marketsData[marketId] != null,
    market,
    loadFullMarket: () => dP.loadFullMarket(marketId),
    submitInitialReport: (estimateGas, marketId, outcomeValue, invalid, history, callback) => dP.submitInitialReport(estimateGas, marketId, outcomeValue, invalid, history, callback),
  }
}

const Reporting = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingReport))

export default Reporting
