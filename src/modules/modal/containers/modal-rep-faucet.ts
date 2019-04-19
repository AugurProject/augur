import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";

import { closeModal } from "modules/modal/actions/close-modal";
import getRep from "modules/account/actions/get-rep";

const mapStateToProps = (state: any) => ({
  modal: state.modal
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  getRep: () => dispatch(getRep())
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "REP Faucet",
  description: ["Get test net REP, it will be sent to your connected wallet."],
  closeAction: () => dP.closeModal(),
  buttons: [
    {
      text: "Get REP",
      action: () => {
        dP.getRep();
        dP.closeModal();
      }
    },
    {
      text: "Cancel",
      action: () => dP.closeModal()
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
