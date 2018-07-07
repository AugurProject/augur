import { connect } from 'react-redux'
import MetaMask from 'modules/auth/components/metamask-connect/metamask-connect'
import isMetaMaskPresent from 'src/modules/auth/helpers/is-meta-mask'
import { loginWithMetaMask } from 'src/modules/auth/actions/login-with-metamask'
import { withRouter } from 'react-router-dom'

const mapStateToProps = state => ({
  isMetaMaskPresent: isMetaMaskPresent(),
})

const mapDispatchToProps = (dispatch, { history }) => ({
  connectMetaMask: () => dispatch(loginWithMetaMask(history)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MetaMask))
