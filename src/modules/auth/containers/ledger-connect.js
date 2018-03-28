import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { augur } from 'services/augurjs'
import LedgerConnect from 'modules/auth/components/ledger-connect/ledger-connect'

import loginWithLedger from 'modules/auth/actions/login-with-ledger'
import { updateModal } from 'modules/modal/actions/update-modal'

const mapStateToProps = state => ({
  networkId: parseInt(augur.rpc.getNetworkID(), 10),
})

const mapDispatchToProps = dispatch => ({
  loginWithLedger: (address, lib) => dispatch(loginWithLedger(address, lib)),
  updateModal: modal => dispatch(updateModal(modal)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LedgerConnect))
