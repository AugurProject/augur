import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { AppState } from "appStore";
import { closeModal } from "modules/modal/actions/close-modal";
import getDai from "modules/account/actions/get-dai";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  getDai: () => dispatch(getDai()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "DAI Faucet",
  description: ["Get test net DAI, it will be sent to your connected wallet."],
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: "Get DAI",
      action: () => {
        dP.getDai();
        dP.closeModal();
      },
    },
    {
      text: "Cancel",
      action: () => dP.closeModal(),
    },
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
