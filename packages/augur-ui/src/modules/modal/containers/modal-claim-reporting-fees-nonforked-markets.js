import { connect } from "react-redux";

import { closeModal } from "modules/modal/actions/close-modal";
import ModalClaimReportingFeesNonforkedMarkets from "modules/modal/components/modal-claim-reporting-fees-nonforked-markets";
import { claimReportingFeesNonforkedMarkets } from "modules/reports/actions/claim-reporting-fees";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

const mapStateToProps = state => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
  gasPrice: getGasPrice(state)
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFeesNonforkedMarkets: (options, callback) =>
    dispatch(claimReportingFeesNonforkedMarkets(options, callback))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalClaimReportingFeesNonforkedMarkets);
