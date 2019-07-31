import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { MARKET_REVIEW_TRADE_SEEN } from "modules/common/constants";
import { Message } from "modules/modal/message";
import { selectMarket } from "modules/markets/selectors/market";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

const mapStateToProps = (state: AppState) => {
  const market = selectMarket(state.modal.marketId);

  return {
    modal: state.modal,
    market,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  markModalAsSeen: () => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(MARKET_REVIEW_TRADE_SEEN, "true");
    }
  },
  unmarkModalAsSeen: () => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.removeItem(MARKET_REVIEW_TRADE_SEEN);
    }
  },
  closeModal: () => {
    dispatch(closeModal());
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Review Market Details",
  description: [
    "Review the markets details to confirm that there are no conflicts, in particular between the Markets Question, Additional Details and Reporting Start Time.",
    "If the reporting start time doesn’t match up to the title or description, the market might resolve as invalid.",
  ],
  marketReview: {
    description: sP.market.description,
    details: sP.market.details,
    endTime: sP.market.endTime,
    resolutionSource: sP.market.resolutionSource,
  },
  checkbox: {
    markModalAsSeen: dP.markModalAsSeen,
    unmarkModalAsSeen: dP.unmarkModalAsSeen,
  },
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "Confirm",
      action: () => {
        if (sP.modal.cb) {
          sP.modal.cb();
        }
        dP.closeModal();
      },
    },
    {
      text: "Cancel",
      action: () => {
        dP.closeModal();
      },
    },
  ],
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Message)
);
