import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingReport from "modules/reporting/components/reporting-report/reporting-report";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP
  };
};

const Reporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ReportingReport)
);

export default Reporting;
