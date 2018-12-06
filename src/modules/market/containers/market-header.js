import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketHeader from "modules/market/components/market-header/market-header";
import { ZERO } from "modules/trades/constants/numbers";
import { selectMarket } from "modules/markets/selectors/market";
import { selectCurrentTimestamp } from "src/select-state";
import marketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);
  const disputeOutcomes = marketDisputeOutcomes() || {};

  return {
    description: market.description || "",
    details: market.details || "",
    marketType: market.marketType,
    maxPrice: market.maxPrice || ZERO,
    minPrice: market.minPrice || ZERO,
    scalarDenomination: market.scalarDenomination,
    resolutionSource: market.resolutionSource,
    currentTimestamp: selectCurrentTimestamp(state) || 0,
    tentativeWinner:
      disputeOutcomes[ownProps.marketId] &&
      disputeOutcomes[ownProps.marketId].find(o => o.tentativeWinning),
    isLogged: state.authStatus.isLogged,
    isForking: state.universe.isForking,
    isDesignatedReporter:
      market.designatedReporter === state.loginAccount.address,
    isMobileSmall: state.appStatus.isMobileSmall,
    market
  };
};

const mapDispatchToProps = dispatch => ({
  finalizeMarket: (marketId, cb) => dispatch(sendFinalizeMarket(marketId, cb))
});

const MarketHeaderContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketHeader)
);

export default MarketHeaderContainer;
