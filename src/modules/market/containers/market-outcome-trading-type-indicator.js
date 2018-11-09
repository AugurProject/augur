import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketOutcomeTradingTypeIndicator from "modules/market/components/market-outcome-trading-type-indicator/market-outcome-trading-type-indicator";
import { selectMarketOutcomeTradingIndicator } from "modules/markets/selectors/select-market-outcome-trading-indicator";

const mapStateToProps = (state, ownProps) => {
  const { marketTradingHistory } = state;
  return {
    tradingIndicator: selectMarketOutcomeTradingIndicator(
      marketTradingHistory,
      ownProps.outcome,
      true
    )
  };
};

const ConnectedMarketOutcomeTradingTypeIndicator = connect(mapStateToProps)(
  withRouter(MarketOutcomeTradingTypeIndicator)
);
export default ConnectedMarketOutcomeTradingTypeIndicator;
