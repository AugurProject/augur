import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingReportMarkets from "modules/reporting/components/reporting-report-markets/reporting-report-markets";
import { loadReporting } from "modules/reports/actions/load-reporting";
import { selectMarketsToReport } from "modules/reports/selectors/select-markets-to-report";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  markets: selectMarketsToReport(state),
  universe: state.universe.id
});

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReporting())
});

const ReportingReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportingReportMarkets)
);

export default ReportingReportingContainer;
