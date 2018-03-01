import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalView from 'modules/modal/components/modal-view/modal-view'

import { closeModal } from 'modules/modal/actions/close-modal'
import { updateEnv } from 'modules/app/actions/update-env'
import { approveAccount } from 'modules/auth/actions/approve-account'

const mapStateToProps = state => ({
  modal: state.modal
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  updateEnv: env => dispatch(updateEnv(env)),
  approveAccount: (cb) => {
    console.log('mapDispatchToProps', cb.toString())
    dispatch(approveAccount(cb))
  },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalView))
