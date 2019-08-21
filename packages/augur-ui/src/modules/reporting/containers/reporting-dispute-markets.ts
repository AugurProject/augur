import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingDisputeMarkets from "modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets";

const mapStateToProps = (state, { history }) => ({});

const mapDispatchToProps = dispatch => ({});

const ReportingDisputeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReportingDisputeMarkets));

export default ReportingDisputeContainer;
