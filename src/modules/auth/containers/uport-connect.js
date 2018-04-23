import { connect } from 'react-redux'
import UportConnect from 'modules/auth/components/uport-connect/uport-connect'
import { loginWithUport } from 'modules/auth/actions/login-with-uport'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
  isMobileSmall: state.isMobileSmall,
})

const mapDispatchToProps = dispatch => ({
  login: account => dispatch(loginWithUport(account)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UportConnect)
