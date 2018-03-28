import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ModalNetworkConnect from 'modules/modal/components/modal-network-connect/modal-network-connect'

import { closeModal } from 'modules/modal/actions/close-modal'
import { updateEnv } from 'modules/app/actions/update-env'
import { connectAugur } from 'modules/app/actions/init-augur'

const mapStateToProps = state => ({
  modal: state.modal,
  env: state.env,
  connection: state.connection,
})

const mapDispatchToProps = dispatch => ({
  submitForm: e => e.preventDefault(),
  updateEnv: env => dispatch(updateEnv(env)),
  closeModal: () => dispatch(closeModal()),
  connectAugur: (history, env, isInitialConnection, cb) => dispatch(connectAugur(history, env, isInitialConnection, cb)),
})
// to make sure we override the generic submitForm with the passed submitForm from a disconnection Modal we need to merge props...
const mergedProps = (sP, dP, oP) => ({ ...sP, ...dP, ...oP })

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergedProps)(ModalNetworkConnect))
