import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LedgerConnect from 'modules/auth/components/ledger-connect/ledger-connect'

import loginWithLedger from 'modules/auth/actions/login-with-ledger'

const mapDispatchToProps = dispatch => ({
  loginWithLedger: (address, lib) => dispatch(loginWithLedger(address, lib))
})

export default withRouter(connect(null, mapDispatchToProps)(LedgerConnect))
