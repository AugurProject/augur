import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalReporting from "modules/modal/reporting";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { selectMarket } from "modules/markets/selectors/market";
import { REPORTING_STATE } from 'modules/common/constants';
import { formatAttoRep } from "utils/format-number";

const mapStateToProps = (state, ownProps) => ({
  modal: state.modal,
  market: selectMarket(ownProps.marketId),
  rep: formatAttoRep(state.loginAccount.balances.rep).formatted
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  const isReporting = sP.market.reportingState === REPORTING_STATE.OPEN_REPORTING || sP.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING;
  return {
    isReporting: isReporting,
    title: isReporting ? "Report on this market" : "Dispute or Support this market’s tenatative winning Outcome",
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...sP
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(ModalReporting),
);
