import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReportingReportMarkets from "modules/reporting/components/reporting-report-markets/reporting-report-markets";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

const ReportingReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportingReportMarkets)
);

export default ReportingReportingContainer;
