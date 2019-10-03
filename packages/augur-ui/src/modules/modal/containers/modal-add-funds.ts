import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { AddFunds } from "modules/modal/add-funds";
import { AppState } from "store";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import getValue from "utils/get-value";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import { NewMarket, NodeStyleCallback } from "modules/types";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AddFunds),
);
