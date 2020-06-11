import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { submitNewMarket } from "modules/markets/actions/submit-new-market";
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { newMarket, modal, loginAccount: { address } } = AppStatus.get();
  return ({
    modal,
    newMarket,
    address,
  });
}

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => AppStatus.actions.closeModal(),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Final confirmation",
  subheader: {
    header: "Are you sure you want to proceeed?",
    subheaders: ["Once you create the market you can’t make any changes to the market or resolution details. Ensure that all market details are accurate before proceeding."]
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
        const { newMarket } = sP;
        submitNewMarket(newMarket);
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
