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
  approveAccount: (cb, onSuccess) => dispatch(approveAccount(cb, onSuccess)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalApproval))
