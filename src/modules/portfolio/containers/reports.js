import { constants } from "services/augurjs";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectCurrentTimestamp } from "src/select-state";
import { each, orderBy } from "lodash";
import PortfolioReports from "modules/portfolio/components/portfolio-reports/portfolio-reports";
import { updateModal } from "modules/modal/actions/update-modal";
import { getReportingFees } from "modules/reports/actions/get-reporting-fees";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import { selectMarket } from "modules/markets/selectors/market";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import marketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import { loadReportingHistory } from "modules/reports/actions/load-reporting-history";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { toggleFavorite } from "modules/markets/actions/update-favorites";

const mapStateToProps = state => {
  const PAGINATION_COUNT = 10;
  const forkedMarket = state.universe.isForking
    ? selectMarket(state.universe.forkingMarket)
    : null;
  const disputeOutcomes = marketDisputeOutcomes() || {};
  const disputableMarkets = [];
  const upcomingDisputableMarkets = [];
  const resolvedMarkets = [];

  const reportedMarkets =
    (state.reports &&
      state.reports.markets &&
      state.reports.markets[state.universe.id]) ||
    [];

  each(reportedMarkets, marketId => {
    const market = selectMarket(marketId);
    switch (market.reportingState) {
      case constants.REPORTING_STATE.CROWDSOURCING_DISPUTE:
        disputableMarkets.push(market);
        break;
      case constants.REPORTING_STATE.AWAITING_NEXT_WINDOW:
        if (!market.forking) {
          upcomingDisputableMarkets.push(market);
        }
        break;
      case constants.REPORTING_STATE.AWAITING_FINALIZATION:
      case constants.REPORTING_STATE.FINALIZED:
        resolvedMarkets.push(market);
        break;
      default:
        console.log("market not in reporting", marketId);
    }
  });

  orderBy(resolvedMarkets, ["endTime.timestamp"], ["desc"]);

  return {
    currentTimestamp: selectCurrentTimestamp(state),
    forkedMarket,
    isLogged: state.authStatus.isLogged,
    isMobile: state.appStatus.isMobile,
    isConnected: state.connection.isConnected && state.universe.id != null,
    reportingFees: state.reportingWindowStats.reportingFees,
    markets: disputableMarkets,
    showPagination: disputableMarkets.length > PAGINATION_COUNT,
    disputableMarketsLength: disputableMarkets.length,
    upcomingMarkets: upcomingDisputableMarkets,
    upcomingMarketsCount: upcomingDisputableMarkets.length,
    showUpcomingPagination: upcomingDisputableMarkets.length > PAGINATION_COUNT,
    paginationCount: PAGINATION_COUNT,
    outcomes: disputeOutcomes,
    resolvedMarkets,
    isForking: state.universe.isForking,
    forkEndTime: state.universe.forkEndTime,
    forkingMarketId: state.universe.forkingMarket
  };
};

const mapDispatchToProps = dispatch => ({
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  getReportingFees: callback => dispatch(getReportingFees(callback)),
  getWinningBalances: marketIds => dispatch(getWinningBalance(marketIds)),
  updateModal: modal => dispatch(updateModal(modal)),
  loadMarkets: () => dispatch(loadReportingHistory()),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PortfolioReports)
);
