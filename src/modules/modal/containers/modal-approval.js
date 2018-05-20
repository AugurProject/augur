import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalApproval from 'modules/modal/components/modal-approval/modal-approval'

import { closeModal } from 'modules/modal/actions/close-modal'
import { approveAccount } from 'modules/auth/actions/approve-account'

const mapStateToProps = state => ({
  modal: state.modal,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  approveAccount: (onSent, onSuccess) => dispatch(approveAccount(onSent, onSuccess)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalApproval))
