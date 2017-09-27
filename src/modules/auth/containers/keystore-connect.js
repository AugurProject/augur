import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import KeystoreConnect from 'modules/auth/components/keystore-connect/keystore-connect'

import { importAccount } from 'modules/auth/actions/import-account'

const mapPropsToState = dispatch => ({
  importAccount: (keystore, password, callback) => dispatch(importAccount(keystore, password, callback))
})

export default withRouter(connect(null, mapPropsToState)(KeystoreConnect))
