import { connect } from 'react-redux'

import { closeModal } from 'modules/modal/actions/close-modal'
import ModalClaimReportingFeesForkedMarket from 'modules/modal/components/modal-claim-reporting-fees-forked-market/modal-claim-reporting-fees-forked-market'
import claimReportingFeesForkedMarket from 'modules/portfolio/actions/claim-reporting-fees-forked-market'
import { getReportingFees } from 'modules/portfolio/actions/get-reporting-fees'
import { updateAssets } from 'modules/auth/actions/update-assets'

const mapStateToProps = state => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFeesForkedMarket: (options, callback) => dispatch(claimReportingFeesForkedMarket(options, callback)),
  getReportingFees: callback => dispatch(getReportingFees(callback)),
  updateAssets: () => dispatch(updateAssets()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalClaimReportingFeesForkedMarket)
