import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { AppState } from "store";
import { closeModal } from "modules/modal/actions/close-modal";
import { approveAccount } from "modules/auth/actions/approve-account";
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
  title: "Approve Augur",
  description: [
    `Current approval is ${sP.account.allowanceFormatted.formatted} DAI`,
    `In order to trade on Augur you must first approve the Augur Contracts to move DAI on your behalf. You will not be able to trade until approval has completed.`,
    `After clicking "Approve" you will be asked to sign a transaction. This will approval for 1 million DAI.`
  ],
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "Approve",
      action: () => {
        dP.approveAccount(sP.modal.approveOnSent, sP.modal.approveCallback);
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
