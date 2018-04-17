import { connect } from 'react-redux'
import UportCreate from 'modules/auth/components/uport-create/uport-create'

import loginWithUport from 'modules/auth/actions/login-with-uport'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
})

const mapDispatchToProps = dispatch => ({
  login: (account, signingFunction) => dispatch(loginWithUport(account, signingFunction)),
})

export default connect(mapStateToProps, mapDispatchToProps)(UportCreate)
