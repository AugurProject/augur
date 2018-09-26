import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalConfirm from "modules/modal/components/modal-confirm/modal-confirm";

import { closeModal } from "modules/modal/actions/close-modal";
import { approveAccount } from "modules/auth/actions/approve-account";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal()),
  approveAccount: (onSent, onSuccess) =>
    dispatch(approveAccount(onSent, onSuccess))
});

const mergeProps = (sP, dP, oP) => ({
  title: "Approve Augur",
  description: [
    `In order to trade on Augur you must first approve the Augur Contracts to move Ether on your behalf. You will be unable to trade until approval has completed.`,
    `After clicking "Approve" you will be asked to sign a transaction, followed by a second transaction to complete your requested trade.`
  ],
  cancelAction: () => {
    sP.modal.approveCallback("close_modal");
  },
  submitButtonText: "Approve",
  submitAction: () => {
    dP.approveAccount(sP.modal.approveOnSent, sP.modal.approveCallback);
  },
  closeModal: dP.closeModal
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalConfirm)
);
