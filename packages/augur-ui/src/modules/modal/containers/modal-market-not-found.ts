import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "appStore";
import makePath from "modules/routes/helpers/make-path";
import { MARKETS } from "modules/routes/constants/views";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    title: `Market Not Found`,
    description: [
      "Please check the market address and try again",
    ],
    closeAction: () => dP.closeModal(),
    buttons: [
      {
        text: "Go to Markets",
        action: () => {
          const { history } = sP.modal;
          history.push({ pathname: makePath(MARKETS) });
          dP.closeModal();
        },
      },
    ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Message),
);
