import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { augur } from 'services/augurjs'
import LedgerConnect from 'modules/auth/components/ledger-connect/ledger-connect'

import loginWithLedger from 'modules/auth/actions/login-with-ledger'
import { updateLedgerStatus } from 'modules/auth/actions/update-ledger-status'
import { onConnectLedgerRequest, onOpenEthereumAppRequest, onSwitchLedgerModeRequest, onEnableContractSupportRequest } from 'modules/auth/actions/ledger-ethereum-hook-actions'

const mapStateToProps = state => ({
  networkId: parseInt(augur.rpc.getNetworkID(), 10),
  ledgerStatus: state.ledgerStatus,
})

const mapDispatchToProps = dispatch => ({
  loginWithLedger: (address, lib) => dispatch(loginWithLedger(address, lib)),
  updateLedgerStatus: status => dispatch(updateLedgerStatus(status)),
  onConnectLedgerRequest: () => dispatch(onConnectLedgerRequest()),
  onOpenEthereumAppRequest: () => dispatch(onOpenEthereumAppRequest()),
  onSwitchLedgerModeRequest: () => dispatch(onSwitchLedgerModeRequest()),
  onEnableContractSupportRequest: () => dispatch(onEnableContractSupportRequest()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LedgerConnect))
