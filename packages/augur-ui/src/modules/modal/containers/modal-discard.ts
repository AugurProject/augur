import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

const mapStateToProps = (state: AppState) => {
  return {
    modal: state.modal,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Discard draft?",
   description: [
    "You will lose any data you have entered."
  ],
  closeAction: () => {
    dP.closeModal();
    if (sP.modal.cb) {
      sP.modal.cb(false);
    }
  },
  buttons: [
    {
      text: "Discard draft",
      action: () => {
        dP.closeModal();
        if (sP.modal.cb) {
          sP.modal.cb(true);
        }
      },
    },
    {
      text: "Cancel",
      type: "gray",
      action: () => {
        dP.closeModal();
        if (sP.modal.cb) {
          sP.modal.cb(false);
        }
      },
    }
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
