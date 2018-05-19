import { connect } from 'react-redux'
import { augur } from 'services/augurjs'
import UportConnect from 'modules/auth/components/uport-connect/uport-connect'
import { loginWithUport } from 'modules/auth/actions/login-with-uport'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
  isMobileSmall: state.isMobileSmall,
  networkId: augur.rpc.getNetworkID(),
})

const mapDispatchToProps = dispatch => ({
  login: (credentials, uPort) => dispatch(loginWithUport(credentials, uPort)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UportConnect)
