import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MyMarkets from "modules/portfolio/components/markets/markets";
import { selectAuthorOwnedMarkets } from "modules/markets/selectors/user-markets";

import { collectMarketCreatorFees } from "modules/markets/actions/market-creator-fees-management";
import marketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";

const mapStateToProps = state => {
  const createdMarkets = selectAuthorOwnedMarkets(state);

  // getMyMarkets or it's equivalent will need a way of calculating the outstanding returns for a market and attaching it to each market object. Currently I've just added a key/value pair to the market objects im using below.
  return {
    isLogged: state.authStatus.isLogged,
    myMarkets: createdMarkets,
    transactionsLoading: state.appStatus.transactionsLoading,
    isMobile: state.appStatus.isMobile,
    pendingLiquidityOrders: state.pendingLiquidityOrders,
    outcomes: marketDisputeOutcomes() || {},
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.reportingWindowStats.endTime
  };
};

const mapDispatchToProps = dispatch => ({
  collectMarketCreatorFees: (getBalanceOnly, marketId, callback) =>
    dispatch(collectMarketCreatorFees(getBalanceOnly, marketId, callback))
});

const MyMarketsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MyMarkets)
);

export default MyMarketsContainer;
