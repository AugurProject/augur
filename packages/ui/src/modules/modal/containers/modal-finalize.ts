import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Message } from "modules/modal/message";
import { selectMarket } from "modules/markets/selectors/market";
import { closeModal } from "modules/modal/actions/close-modal";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";

const mapStateToProps = (state: any) => {
  const market = selectMarket(state.modal.marketId);

  return {
    modal: state.modal,
    marketDescription: market.description
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  finalizeMarket: (marketId: string, cb: Function) =>
    dispatch(sendFinalizeMarket(marketId, cb))
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Finalize Market",
  alertMessage: {
    preText: "The following market is resolved and ready to be finalized:"
  },
  marketTitle: sP.marketDescription,
  callToAction: "Please finalize this market so proceeds can be claimed.",
  closeAction: () => {
    dP.closeModal();
    if (sP.modal.cb) {
      sP.modal.cb();
    }
  },
  buttons: [
    {
      text: "Finalize",
      action: () => {
        dP.finalizeMarket(sP.modal.marketId, sP.modal.cb);
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
