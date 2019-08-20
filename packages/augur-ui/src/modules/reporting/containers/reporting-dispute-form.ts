import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingDisputeForm from "modules/reporting/components/reporting-dispute-form/reporting-dispute-form";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-info";

const mapStateToProps = (state, ownProps) => {
  const disputeOutcomes = {}; // marketDisputeOutcomes() || {};

  return {
    isLogged: state.authStatus.isLogged,
    universe: state.universe.id,
    forkThreshold: state.universe.forkThreshold,
    outcomes: disputeOutcomes[ownProps.market.id],
    market: ownProps.market,
    isMobile: state.appStatus.isMobile
  };
};

const mapDispatchToProps = dispatch => ({
  loadMarketsDisputeInfo: (marketId, callback) =>
    dispatch(loadMarketsDisputeInfo([marketId], callback))
});

const mergeProps = (sP, dP, oP) => {
  const accountDisputeData = sP.accountDisputeState[sP.market.id];

  return {
    ...oP,
    ...sP,
    accountDisputeData,
    loadMarketsDisputeInfo: (marketId, callback) =>
      dP.loadMarketsDisputeInfo([marketId], callback)
  };
};

const Reporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ReportingDisputeForm)
);

export default Reporting;
