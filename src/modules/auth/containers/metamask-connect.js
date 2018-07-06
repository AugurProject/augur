import { connect } from 'react-redux'
import MetaMask from 'modules/auth/components/metamask-connect/metamask-connect'
import isMetaMaskPresent from 'src/modules/auth/helpers/is-meta-mask'
import { loginWithMetaMask } from 'src/modules/auth/actions/login-with-metamask'

const mapStateToProps = state => ({
  isMetaMaskPresent: isMetaMaskPresent(),
})

const mapDispatchToProps = dispatch => ({
  connectMetaMask: () => dispatch(loginWithMetaMask()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MetaMask)
