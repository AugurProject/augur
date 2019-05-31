import { connect } from "react-redux";
import { closeModal } from "modules/modal/actions/close-modal";
import ModalClaimReportingFeesForkedMarket from "modules/modal/components/modal-claim-reporting-fees-forked-market";
import { claimReportingFeesForkedMarket } from "modules/reports/actions/claim-reporting-fees";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  recipient: state.loginAccount.address,
  gasPrice: getGasPrice(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  claimReportingFeesForkedMarket: (options, callback) =>
    dispatch(claimReportingFeesForkedMarket(options, callback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalClaimReportingFeesForkedMarket);
