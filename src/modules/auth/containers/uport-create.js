import { connect } from 'react-redux'
import { augur } from 'services/augurjs'
import UportCreate from 'modules/auth/components/uport-create/uport-create'
import { loginWithUport } from 'modules/auth/actions/login-with-uport'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
  networkId: augur.rpc.getNetworkID(),
})

const mapDispatchToProps = dispatch => ({
  login: (credentials, uPort) => dispatch(loginWithUport(credentials, uPort)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UportCreate)
