import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ModalReporting from "modules/modal/reporting";
import { closeModal } from "modules/modal/actions/close-modal";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { REPORTING_STATE } from 'modules/common/constants';
import { formatAttoRep } from "utils/format-number";
import { doInitialReport, contribute } from "modules/contracts/actions/contractCalls";

const mapStateToProps = (state, ownProps) => ({
  modal: state.modal,
  market: ownProps.market,
  rep: formatAttoRep(state.loginAccount.balances.rep).formatted
});

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
});

const mergeProps = (sP, dP, oP) => {
  let reportAction = contribute;
  const isReporting = sP.market.reportingState === REPORTING_STATE.OPEN_REPORTING || sP.market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING;
  if (!isReporting) {
    reportAction = doInitialReport;
  }
  return {
    isReporting: isReporting,
    title: isReporting ? "Report on this market" : "Dispute or Support this market’s tenatative winning Outcome",
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    ...oP,
    reportAction,
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
