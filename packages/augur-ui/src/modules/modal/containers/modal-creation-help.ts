import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { approveToTrade } from "modules/contracts/actions/contractCalls";
import { AppState } from "store";
import { MARKET_CREATION_COPY } from "modules/create-market/constants";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
  account: state.loginAccount,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  approveAccount: () => approveToTrade()
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: oP.copyType && MARKET_CREATION_COPY[oP.copyType].title,
  description: oP.copyType && MARKET_CREATION_COPY[oP.copyType].subheader,
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "Close",
      action: () => {
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
