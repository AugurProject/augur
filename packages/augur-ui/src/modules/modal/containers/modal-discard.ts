import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";
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
    "You will love any data you have entered."
  ],
  callToAction: "Discard draft.",
  closeAction: () => {
    dP.closeModal();
    if (sP.modal.cb) {
      sP.modal.cb();
    }
  },
  buttons: [
    {
      text: "Discard draft",
      action: () => {
        dP.finalizeMarket(sP.modal.marketId, sP.modal.cb);
        dP.closeModal();
      },
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
