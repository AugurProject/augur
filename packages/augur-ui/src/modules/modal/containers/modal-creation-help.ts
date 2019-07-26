import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  account: state.loginAccount,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  approveAccount: () =>
    dispatch(approveAccount())
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Market Creation Help",
  description: [
    `Info about market creation`,
  ],
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "Close",
      action: () => {
        dP.closeModal();
      }
    }
  ]
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
