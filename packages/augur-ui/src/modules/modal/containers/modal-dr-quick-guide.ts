import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => {

  return {
    modal: state.modal,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal())
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Reporting Quick guide",
  callToAction: "",
  content: "",
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "Learn More about Reporting",
      action: () => {
        dP.closeModal();
      },
    },
    {
      text: "Cancel",
      action: () => {
        dP.closeModal();
      }
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
