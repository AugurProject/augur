import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ModalNetworkConnect from 'modules/modal/components/modal-network-connect/modal-network-connect'

import { closeModal } from 'modules/modal/actions/close-modal'
import { updateEnv } from 'modules/app/actions/update-env'
// import { updateModal } from 'modules/modal/actions/update-modal'
// import { MODAL_NETWORK_CONNECT } from 'modules/modal/constants/modal-types'
import { updateIsReconnectionPaused } from 'modules/app/actions/update-connection'
import { connectAugur } from 'modules/app/actions/init-augur'

const mapStateToProps = state => ({
  modal: state.modal,
  env: state.env,
  connection: state.connection,
})

const mapDispatchToProps = dispatch => ({
  submitForm: (e, env) => {
    e.preventDefault()
    dispatch(updateEnv(env))
    dispatch(updateIsReconnectionPaused(false))
  },
  connectAugur: (history, env, isInitialConnection) => dispatch(connectAugur(history, env, isInitialConnection, (err, res) => {
    // console.log('back from connect', err, res);
    // TODO: error handling will go in here, going to need to handle both connect and disconnect currently.
    // TODO: consider wether we show reconnection if this isn't initialConnection.
    if (!err && !res) {
      dispatch(closeModal())
    }
  })),
})

const mergeProps = (sP, dP, oP) => {
  const MergedProps = { ...sP, ...dP, ...oP }
  return MergedProps
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalNetworkConnect))
