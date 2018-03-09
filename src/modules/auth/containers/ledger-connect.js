import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { augur } from 'services/augurjs'
import LedgerConnect from 'modules/auth/components/ledger-connect/ledger-connect'

import loginWithLedger from 'modules/auth/actions/login-with-ledger'

const mapStateToProps = state => ({
  networkId: augur.rpc.getNetworkID(),
})

const mapDispatchToProps = dispatch => ({
  loginWithLedger: (address, lib) => dispatch(loginWithLedger(address, lib)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LedgerConnect))
