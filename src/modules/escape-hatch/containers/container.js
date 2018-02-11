import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import EscapeHatchView from 'modules/escape-hatch/components/escape-hatch'

import selectEscapeHatchData from 'modules/escape-hatch/selectors/escape-hatch-data'

import { loadUserMarkets } from 'modules/markets/actions/load-user-markets'
import updateEmergencyWithdrawlAssets from 'modules/escape-hatch/actions/update-emergency-withdrawl-assets'
import withdrawFundsInEmergency from 'modules/escape-hatch/actions/withdraw-funds-in-emergency'

import logError from 'utils/log-error'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  loginAccount: state.loginAccount,
  escapeHatchData: selectEscapeHatchData(state),
})

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadUserMarkets((err, marketIDs) => {
    if (err) return logError(err)
    dispatch(updateEmergencyWithdrawlAssets(marketIDs))
  })),
  withdrawFundsInEmergency: (ownedMarkets, marketsWithShares) => dispatch(withdrawFundsInEmergency(ownedMarkets, marketsWithShares)),
})

const EscapeHatch = withRouter(connect(mapStateToProps, mapDispatchToProps)(EscapeHatchView))

export default EscapeHatch
