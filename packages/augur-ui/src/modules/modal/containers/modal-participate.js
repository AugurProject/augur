import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ModalParticipate from 'modules/modal/components/modal-participate/modal-participate'
import { purchaseParticipationTokens } from 'modules/reporting/actions/purchase-participation-tokens'

import { closeModal } from 'modules/modal/actions/close-modal'

const mapStateToProps = state => ({
  modal: state.modal,
  rep: state.loginAccount.rep,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  purchaseParticipationTokens: (amount, gasEstimate, callback) => dispatch(purchaseParticipationTokens(amount, gasEstimate, callback)),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalParticipate))
