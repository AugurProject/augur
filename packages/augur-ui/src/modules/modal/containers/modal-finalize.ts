import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Message } from "modules/modal/message";
import { selectMarket } from "modules/markets/selectors/market";
import { closeModal } from "modules/modal/actions/close-modal";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { AppState } from "appStore";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => {
  const { modal } = AppStatus.get();
  const market = selectMarket(modal.marketId);

  return {
    modal,
    marketDescription: market.description,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
  finalizeMarket: (marketId: string, cb: NodeStyleCallback) =>
    sendFinalizeMarket(marketId, cb),
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Finalize Warp Sync Market",
  marketTitle: sP.marketDescription,
  callToAction: "Please finalize warp sync market to claim REP reward. The reward will be transferred to your signing wallet",
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
      },
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
