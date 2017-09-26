import { connect } from 'react-redux'
import KeystoreCreate from 'modules/auth/components/keystore-create/keystore-create'

import { register } from 'modules/auth/actions/register'

const mapPropsToState = dispatch => ({
  register: (password, callback) => dispatch(register(password, callback))
})

export default connect(null, mapPropsToState)(KeystoreCreate)
