import { connect } from 'react-redux'

import { closeModal } from 'modules/modal/actions/close-modal'
import ModalClaimReportingFees from 'modules/modal/components/modal-claim-reporting-fees/modal-claim-reporting-fees'
import claimReportingFees from 'modules/portfolio/actions/claim-reporting-fees'

const mapStateToProps = state => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFees: (options, callback) => dispatch(claimReportingFees(options, callback)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalClaimReportingFees)
