import { connect } from 'react-redux'

import { closeModal } from 'modules/modal/actions/close-modal'
import ModalClaimReportingFeesForkedMarket from 'modules/modal/components/modal-claim-reporting-fees-forked-market/modal-claim-reporting-fees-forked-market'
import claimReportingFeesForkedMarket from 'modules/portfolio/actions/claim-reporting-fees-forked-market'

const mapStateToProps = state => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFeesForkedMarket: (options, callback) => dispatch(claimReportingFeesForkedMarket(options, callback)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalClaimReportingFeesForkedMarket)
