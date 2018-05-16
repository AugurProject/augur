import { connect } from 'react-redux'

import { closeModal } from 'modules/modal/actions/close-modal'
import ModalClaimReportingFeesNonforkedMarkets from 'modules/modal/components/modal-claim-reporting-fees-nonforked-markets/modal-claim-reporting-fees-nonforked-markets'
import claimReportingFeesNonforkedMarkets from 'modules/portfolio/actions/claim-reporting-fees-nonforked-markets'
import { getReportingFees } from 'modules/portfolio/actions/get-reporting-fees'
import { updateAssets } from 'modules/auth/actions/update-assets'

const mapStateToProps = state => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFeesNonforkedMarkets: (options, callback) => dispatch(claimReportingFeesNonforkedMarkets(options, callback)),
  getReportingFees: callback => dispatch(getReportingFees(callback)),
  updateAssets: () => dispatch(updateAssets()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalClaimReportingFeesNonforkedMarkets)
