import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingResolved from "modules/reporting/components/reporting-resolved/reporting-resolved";
import { loadReporting } from "src/modules/reports/actions/load-reporting";
import { selectMarketsToReport } from "modules/reports/selectors/select-markets-to-report";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

import getValue from "utils/get-value";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = state => ({
  isLogged: state.authStatus.isLogged,
  isMobile: state.appStatus.isMobile,
  markets: getValue(selectMarketsToReport(state), "resolved"),
  isForkingMarketFinalized: state.universe.isForkingMarketFinalized,
  forkingMarket: state.universe.isForking
    ? selectMarket(state.universe.forkingMarket)
    : null
});

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReporting()),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId))
});

const ReportingResolvedContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportingResolved)
);

export default ReportingResolvedContainer;
