import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReportingReportMarkets from "modules/reporting/components/reporting-report-markets/reporting-report-markets";
import { loadReporting } from "modules/reports/actions/load-reporting";
import { selectMarketsToReport } from "modules/reports/selectors/select-markets-to-report";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

const mapStateToProps = state => {
  const drAddress = state.loginAccount.address;
  const marketsData = selectMarkets(state);
  const markets = selectMarketsToReport(marketsData, drAddress);
  const { designated, open, upcoming } = state.marketReportState;

  return {
    isLogged: state.authStatus.isLogged,
    markets,
    marketIds: { designated, open, upcoming },
    universe: state.universe.id
  };
};

const mapDispatchToProps = dispatch => ({
  loadReporting: cb => dispatch(loadReporting(null, cb)),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds))
});

const ReportingReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportingReportMarkets)
);

export default ReportingReportingContainer;
