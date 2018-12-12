import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ReportingDisputeMarkets from "modules/reporting/components/reporting-dispute-markets/reporting-dispute-markets";
import makePath from "modules/routes/helpers/make-path";
import { ACCOUNT_DEPOSIT } from "modules/routes/constants/views";
import { selectLoginAccount } from "modules/auth/selectors/login-account";
import { selectMarketsInDispute } from "modules/reports/selectors/select-dispute-markets";
import awaitingDisputeMarkets from "modules/reports/selectors/select-awaiting-dispute-markets";
import { loadDisputing } from "modules/reports/actions/load-disputing";
import marketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";

const mapStateToProps = (state, { history }) => {
  const PAGINATION_COUNT = 10;
  const loginAccount = selectLoginAccount(state);
  const disputeOutcomes = marketDisputeOutcomes() || {};
  const disputableMarkets = selectMarketsInDispute(state) || [];
  const upcomingDisputableMarkets = awaitingDisputeMarkets() || [];
  const { isForking, forkEndTime, forkingMarket, id } = state.universe;
  return {
    isLogged: state.authStatus.isLogged,
    isConnected: state.connection.isConnected && id != null,
    doesUserHaveRep: loginAccount.rep.value > 0 || !state.authStatus.isLogged,
    markets: disputableMarkets,
    showPagination: disputableMarkets.length > PAGINATION_COUNT,
    disputableMarketsLength: disputableMarkets.length,
    paginationCount: PAGINATION_COUNT,
    upcomingMarkets: upcomingDisputableMarkets,
    upcomingMarketsCount: upcomingDisputableMarkets.length,
    showUpcomingPagination: upcomingDisputableMarkets.length > PAGINATION_COUNT,
    isMobile: state.appStatus.isMobile,
    navigateToAccountDepositHandler: () =>
      history.push(makePath(ACCOUNT_DEPOSIT)),
    outcomes: disputeOutcomes,
    isForking,
    forkEndTime,
    forkingMarketId: forkingMarket
  };
};

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadDisputing())
});

const ReportingDisputeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReportingDisputeMarkets));

export default ReportingDisputeContainer;
