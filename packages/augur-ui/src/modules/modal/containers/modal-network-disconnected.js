import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalNetworkDisconnected from 'modules/modal/components/modal-network-disconnected/modal-network-disconnected'

import { updateIsReconnectionPaused } from 'modules/app/actions/update-connection'

const mapStateToProps = state => ({
  modal: state.modal,
})

const mapDispatchToProps = dispatch => ({
  updateIsReconnectionPaused: isReconnectionPaused => dispatch(updateIsReconnectionPaused(isReconnectionPaused)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalNetworkDisconnected))
