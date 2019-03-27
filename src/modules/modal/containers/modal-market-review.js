import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalMarketReview from "modules/modal/components/modal-market-review";
import { closeModal } from "modules/modal/actions/close-modal";
import { MARKET_REVIEW_SEEN } from "src/modules/modal/constants/local-storage-keys";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  markModalAsSeen: () => {
    const localStorageRef =
      typeof window !== "undefined" && window.localStorage;
    if (localStorageRef && localStorageRef.setItem) {
      localStorageRef.setItem(MARKET_REVIEW_SEEN, true);
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
  }
});

const mergeProps = (sP, dP, oP) => {
  const { marketId } = sP.modal;
  const market = selectMarket(marketId);

  return {
    modal: sP.modal,
    closeModal: dP.closeModal,
    markModalAsSeen: dP.markModalAsSeen,
    unmarkModalAsSeen: dP.unmarkModalAsSeen,
    handleAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    market
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ModalMarketReview)
);
