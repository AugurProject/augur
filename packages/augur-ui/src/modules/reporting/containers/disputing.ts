import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingDispute from "modules/reporting/components/reporting-dispute/reporting-dispute";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";

const mapStateToProps = state => ({
  isConnected: state.auth.isConnected
});

const mapDispatchToProps = dispatch => ({
  loadDisputeWindow: () => dispatch(loadDisputeWindow()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP,
  };
};

const Reporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ReportingDispute)
);

export default Reporting;
