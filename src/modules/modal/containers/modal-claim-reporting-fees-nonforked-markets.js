import { connect } from 'react-redux'

import { closeModal } from 'modules/modal/actions/close-modal'
import ModalClaimReportingFeesNonforkedMarkets from 'modules/modal/components/modal-claim-reporting-fees-nonforked-markets/modal-claim-reporting-fees-nonforked-markets'
import claimReportingFeesNonforkedMarkets from 'modules/portfolio/actions/claim-reporting-fees-nonforked-markets'

const mapStateToProps = state => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFeesNonforkedMarkets: (options, callback) => dispatch(claimReportingFeesNonforkedMarkets(options, callback)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalClaimReportingFeesNonforkedMarkets)
