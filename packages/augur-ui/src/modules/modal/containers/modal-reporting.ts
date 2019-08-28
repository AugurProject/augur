import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalReporting from "modules/modal/reporting";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = (state, ownProps) => ({
  modal: state.modal,
  market: selectMarket(ownProps.marketId)
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    title: "Report on this market",
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    market: sP.market
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(ModalReporting),
);
