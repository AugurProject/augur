import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";

import { closeModal } from "modules/modal/actions/close-modal";
import { approveAccount } from "modules/auth/actions/approve-account";

const mapStateToProps = (state: any) => ({
  modal: state.modal
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  approveAccount: (onSent: Function, onSuccess: Function) =>
    dispatch(approveAccount(onSent, onSuccess))
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Approve Augur",
  description: [
    `In order to trade on Augur you must first approve the Augur Contracts to move Ether on your behalf. You will be unable to trade until approval has completed.`,
    `After clicking "Approve" you will be asked to sign a transaction, followed by a second transaction to complete your requested trade.`
  ],
  closeAction: () => {
    sP.modal.approveCallback("close_modal");
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
    mergeProps
  )(Message)
);
