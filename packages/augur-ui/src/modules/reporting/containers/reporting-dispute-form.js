import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingDisputeForm from "modules/reporting/components/reporting-dispute-form/reporting-dispute-form";
import { addUpdateAccountDispute } from "modules/reports/actions/update-account-disputes";
import { selectMarketDisputeOutcomes } from "modules/reports/selectors/select-market-dispute-outcomes";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-info";

const mapStateToProps = (state, ownProps) => {
  const disputeOutcomes = selectMarketDisputeOutcomes(state) || {};

  return {
    isLogged: state.authStatus.isLogged,
    universe: state.universe.id,
    forkThreshold: state.universe.forkThreshold,
    outcomes: disputeOutcomes[ownProps.market.id],
    market: ownProps.market,
    isMobile: state.appStatus.isMobile,
    accountDisputeState: state.accountDisputes
  };
};

const mapDispatchToProps = dispatch => ({
  loadMarketsDisputeInfo: (marketId, callback) =>
    dispatch(loadMarketsDisputeInfo([marketId], callback)),
  addUpdateAccountDispute: data => dispatch(addUpdateAccountDispute(data))
});

const mergeProps = (sP, dP, oP) => {
  const accountDisputeData = sP.accountDisputeState[sP.market.id];

  return {
    ...oP,
    ...sP,
    accountDisputeData,
    loadMarketsDisputeInfo: (marketId, callback) =>
      dP.loadMarketsDisputeInfo([marketId], callback),
    addUpdateAccountDispute: data => dP.addUpdateAccountDispute(data)
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
