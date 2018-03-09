import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalParticipate from 'modules/modal/components/modal-participate/modal-participate'

import { closeModal } from 'modules/modal/actions/close-modal'

const mapStateToProps = state => ({
  modal: state.modal,
  rep: state.loginAccount.rep,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalParticipate))
