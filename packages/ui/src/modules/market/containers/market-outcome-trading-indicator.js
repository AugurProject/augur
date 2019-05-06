import { connect } from "react-redux";

import OutcomeTradingIndicator from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator";
import { selectMarketOutcomeTradingIndicator } from "modules/markets/selectors/select-market-outcome-trading-indicator";

const mapStateToProps = (state, ownProps) => {
  const { marketTradingHistory, isMobile } = state;
  return {
    tradingIndicator: selectMarketOutcomeTradingIndicator(
      marketTradingHistory,
      ownProps.outcome
    ),
    location: ownProps.location,
    isMobile
  };
};

const MarketOutcomeTradingIndicator = connect(mapStateToProps)(
  OutcomeTradingIndicator
);

export default MarketOutcomeTradingIndicator;
