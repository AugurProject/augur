import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { AppState } from "appStore";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import getValue from "utils/get-value";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import { NewMarket, NodeStyleCallback } from "modules/types";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  newMarket: state.newMarket,
  address: getValue(state, "loginAccount.address"),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  submitNewMarket: (data: NewMarket, cb: NodeStyleCallback) =>
    dispatch(submitNewMarket(data, cb)),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Final confirmation",
  subheader: {
    header: "Are you sure you want to proceeed?",
    subheaders: ["Once you create the market you can’t make any changes to the market or resolution details . Ensure that all market details are accurate before proceeding."]
  },
  subheader_2: {
    header: "Ready to proceed? Here’s what happens next, you will:",
    numbered: true,
    subheaders: [
      "Be taken to the portfolio page where your market will be listed as “Pending”",
      "Receive an alert when the market has been processed",
      "Receive a notification in your Account Summary to submit any initial liquidity previously entered"
    ]
  },
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: "Confirm",
      action: () => {
        const { newMarket, address } = sP;
        dP.submitNewMarket(newMarket);
        if (sP.modal.cb) {
          sP.modal.cb();
        }
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
