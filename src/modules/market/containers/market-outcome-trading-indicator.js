import { connect } from "react-redux";

import OutcomeTradingIndicator from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator";
import { selectMarketOutcomeTradingIndicator } from "modules/market/selectors/select-market-outcome-trading-indicator";

const mapStateToProps = (state, ownProps) => {
  const { marketTradingHistory, isMobile } = state;
  return {
    tradingIndicator: selectMarketOutcomeTradingIndicator(
      marketTradingHistory,
      ownProps.outcome
    ),
    isMobile
  };
};

const MarketBasicsContainer = connect(mapStateToProps)(OutcomeTradingIndicator);

export default MarketBasicsContainer;
