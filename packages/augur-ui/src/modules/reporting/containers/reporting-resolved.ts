import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { REPORTING_STATE } from "modules/common/constants";
import ReportingResolved from "modules/reporting/components/reporting-resolved/reporting-resolved";
import { loadReportingFinal } from "modules/reports/actions/load-reporting-final";

import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = state => {
  const marketsData = selectMarkets(state);
  const resolvedMarkets = marketsData.filter(
    market =>
      market.reportingState === REPORTING_STATE.FINALIZED
  );
  const resolvedMarketIds = state.marketReportState.resolved || [];

  return {
    isConnected: !!state.universe.id,
    isLogged: state.authStatus.isLogged,
    isMobile: state.appStatus.isMobile,
    resolvedMarkets,
    resolvedMarketIds,
    isForkingMarketFinalized: state.universe.isForkingMarketFinalized,
    forkingMarket: state.universe.isForking
      ? selectMarket(state.universe.forkingMarket)
      : null
  };
};

const mapDispatchToProps = dispatch => ({
  loadReporting: () => dispatch(loadReportingFinal()),
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
