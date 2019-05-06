import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectMarket } from "modules/markets/selectors/market";
import MarketHeaderReporting from "modules/market/components/market-header/market-header-reporting";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import marketDisputeOutcomes from "modules/reports/selectors/select-market-dispute-outcomes";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_CLAIM_TRADING_PROCEEDS } from "modules/common-elements/constants";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);
  const disputeOutcomes = marketDisputeOutcomes() || {};
  return {
    currentTimestamp:
      selectCurrentTimestampInSeconds(state) || Math.floor(new Date() / 1000),
    market,
    isLogged: state.authStatus.isLogged,
    isDesignatedReporter:
      market.designatedReporter === state.loginAccount.address,
    tentativeWinner:
      disputeOutcomes[ownProps.marketId] &&
      disputeOutcomes[ownProps.marketId].find(o => o.tentativeWinning)
  };
};

const mapDispatchToProps = dispatch => ({
  finalizeMarket: (marketId, cb) => dispatch(sendFinalizeMarket(marketId, cb)),
  claimTradingProceeds: (marketId, cb) =>
    dispatch(updateModal({ type: MODAL_CLAIM_TRADING_PROCEEDS, marketId, cb }))
});

const MarketHeaderReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketHeaderReporting)
);

export default MarketHeaderReportingContainer;
