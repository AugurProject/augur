import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { MARKET_REVIEW_SEEN } from "modules/common-elements/constants";
import { Message } from "modules/modal/message";
import { closeModal } from "modules/modal/actions/close-modal";
import { AppState } from "store";

const mapStateToProps = (state: AppState) => ({
  modal: state.modal,
});

const mapDispatchToProps = (dispatch: any) => ({
  markModalAsSeen: () => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(MARKET_REVIEW_SEEN, "true");
    }
  },
  unmarkModalAsSeen: () => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.removeItem(MARKET_REVIEW_SEEN);
    }
  },
  closeModal: () => {
    dispatch(closeModal());
  },
});

const mergeProps = (sP: any, dP: any, oP: any) => ({
  title: "Review Market Details",
  description: [
    "Markets on Augur are created by the community, this means that errors can be made in the creation of a market that result in the market being resolved as invalid.",
    "Always make sure that the Market Question, Additional Details, Reporting Start Time, Resolution Source and Outcomes are not in direct conflict with each other. Always make sure the market has mutually exclusive outcomes, i.e. only one outcome can occur.",
    "If the reporting start time (UTC) isn’t after the actual end of the event, or if the title/description and reporting start time don’t match up, there is a high probability that the market will resolve as invalid.",
  ],
  checkbox: {
    markModalAsSeen: dP.markModalAsSeen,
    unmarkModalAsSeen: dP.unmarkModalAsSeen,
  },
  closeAction: () => {
    dP.closeModal();
  },
  buttons: [
    {
      text: "OK",
      action: () => {
        if (sP.modal.cb) {
          sP.modal.cb();
        }
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
