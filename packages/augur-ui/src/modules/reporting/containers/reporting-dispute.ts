import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingDispute from "modules/reporting/components/reporting-dispute/reporting-dispute";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

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
