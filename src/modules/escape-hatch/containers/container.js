import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { augur } from 'services/augurjs'
import EscapeHatchView from 'modules/escape-hatch/components/escape-hatch'

import selectEscapeHatchData from 'modules/escape-hatch/selectors/escape-hatch-data'

import { loadUserMarkets } from 'modules/markets/actions/load-user-markets'
import loadEmergencyWithdrawalAssets from 'modules/escape-hatch/actions/load-emergency-withdrawal-assets'
import loadUserParticipationTokens from 'modules/my-participation-tokens/actions/load-participation-tokens'
import loadUserInitialReporters from 'modules/my-initial-reporters/actions/load-initial-reporters'
import loadUserDisputeCrowdsourcers from 'modules/my-dispute-crowdsourcer-tokens/actions/load-dispute-crowdsourcer-tokens'
import withdrawFundsInEmergency from 'modules/escape-hatch/actions/withdraw-funds-in-emergency'
import logError from 'utils/log-error'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  loginAccount: state.loginAccount,
  escapeHatchData: selectEscapeHatchData(state),
  gasPrice: augur.rpc.getGasPrice(),
})

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadUserMarkets((err, ownedMarketIds) => {
    if (err) return logError(err)
    dispatch(loadEmergencyWithdrawalAssets(ownedMarketIds))
  })),
  loadParticipationTokens: () => dispatch(loadUserParticipationTokens()),
  loadInitialReporters: () => dispatch(loadUserInitialReporters()),
  loadDisputeCrowdsourcers: () => dispatch(loadUserDisputeCrowdsourcers()),
  withdrawFundsInEmergency: (ownedMarkets, marketsWithShares) => dispatch(withdrawFundsInEmergency(ownedMarkets, marketsWithShares)),
})

const EscapeHatch = withRouter(connect(mapStateToProps, mapDispatchToProps)(EscapeHatchView))

export default EscapeHatch
