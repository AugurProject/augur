import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { MODAL_LEDGER, MODAL_TREZOR } from "modules/common-elements/constants";

const signerTypes = {
  [MODAL_LEDGER]: "Ledger",
  [MODAL_TREZOR]: "Trezor"
};

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
});

const mergeProps = (sP, dP, oP) => {
  const type = signerTypes[sP.modal.type];
  return {
    title: `${type} Information`,
    description: [
      sP.modal.error ? sP.modal.error : `Please sign transaction on ${type}.`
    ],
    buttons: sP.modal.error
      ? [
          {
            text: "Close",
            action: () => dP.closeModal()
          }
        ]
      : [],
    closeAction: () => dP.closeModal()
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
