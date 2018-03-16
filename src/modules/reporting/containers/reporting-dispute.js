import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ReportingDispute from 'modules/reporting/components/reporting-dispute/reporting-dispute'
import { loadFullMarket } from 'modules/market/actions/load-full-market'
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'
import { selectMarket } from 'modules/market/selectors/market'
import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'

import { submitMarketContribute } from 'modules/reporting/actions/submit-market-contribute'
import { estimateSubmitMarketContribute } from 'modules/reporting/actions/estimate-submit-market-contribute'
import { getDisputeInfo } from 'modules/reporting/actions/get-dispute-info'
import { addUpdateAccountDispute } from 'modules/reporting/actions/update-account-disputes'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  // might need to call get market cost breakdown, it's on market from augur-node
  isConnected: state.connection.isConnected,
  universe: state.universe.id,
  marketsData: state.marketsData,
  isMobile: state.isMobile,
  accountDisputeState: state.accountDisputes,
})

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  submitMarketContribute: (marketId, outcomeValue, amount, invalid, history) => dispatch(submitMarketContribute(marketId, outcomeValue, amount, invalid, history)),
  estimateSubmitMarketContribute: (marketId, outcomeValue, amount, invalid, history) => dispatch(estimateSubmitMarketContribute(marketId, outcomeValue, amount, invalid, history)),
  getDisputeInfo: (marketId, callback) => dispatch(getDisputeInfo(marketId, callback)),
  addUpdateAccountDispute: data => dispatch(addUpdateAccountDispute(data)),
})


const mergeProps = (sP, dP, oP) => {
  const marketId = parseQuery(oP.location.search)[MARKET_ID_PARAM_NAME]
  const market = selectMarket(marketId)
  const accountDisputeData = sP.accountDisputeState[marketId]

  return {
    ...oP,
    ...sP,
    marketId,
    isLogged: sP.isLogged,
    isConnected: sP.isConnected && getValue(sP, 'universe.id') != null,
    isMarketLoaded: sP.marketsData[marketId] != null,
    market,
    accountDisputeData,
    loadFullMarket: () => dP.loadFullMarket(marketId),
    submitMarketContribute: (marketId, selectedOutcome, invalid, amount, history) => dP.submitMarketContribute(marketId, selectedOutcome, invalid, amount, history),
    estimateSubmitMarketContribute: (marketId, selectedOutcome, invalid, amount, history) => dP.estimateSubmitMarketContribute(marketId, selectedOutcome, invalid, amount, history),
    getDisputeInfo: (marketId, callback) => dP.getDisputeInfo(marketId, callback),
    addUpdateAccountDispute: data => dP.addUpdateAccountDispute(data),
  }
}

const Reporting = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReportingDispute))

export default Reporting
