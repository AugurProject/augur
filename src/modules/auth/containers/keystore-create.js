import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import KeystoreCreate from 'modules/auth/components/keystore-create/keystore-create'

import { register } from 'modules/auth/actions/register'
import { login } from 'modules/auth/actions/login'

const mapPropsToState = dispatch => ({
  register: (password, callback) => dispatch(register(password, callback)),
  login: (keystore, password, callback) => dispatch(login(keystore, password, callback))
})

export default withRouter(connect(null, mapPropsToState)(KeystoreCreate))
