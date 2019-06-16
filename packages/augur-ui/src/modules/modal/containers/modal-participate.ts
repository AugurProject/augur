import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalParticipate from "modules/modal/components/modal-participate";
import { purchaseParticipationTokens } from "modules/reports/actions/participation-tokens-management";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  rep: state.loginAccount.rep,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  purchaseParticipationTokens: (amount, gasEstimate, callback) =>
    dispatch(purchaseParticipationTokens(amount, gasEstimate, callback)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ModalParticipate),
);
