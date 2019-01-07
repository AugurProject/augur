import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReportingReportMarkets from "modules/reporting/components/reporting-report-markets/reporting-report-markets";
import { loadReporting } from "modules/reports/actions/load-reporting";
import { selectMarketsToReport } from "modules/reports/selectors/select-markets-to-report";
import { selectMarkets } from "src/modules/markets/selectors/markets-all";

const mapStateToProps = state => {
  const marketsData = selectMarkets(state);
  const markets = selectMarketsToReport(marketsData);

  return {
    isLogged: state.authStatus.isLogged,
    markets,
    universe: state.universe.id
  };
};

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
