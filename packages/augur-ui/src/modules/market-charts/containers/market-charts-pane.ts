import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketChartsPane from "modules/market-charts/components/market-charts-pane/market-charts-pane";
import { selectMarket } from "modules/markets/selectors/market";
import { createBigNumber } from "utils/create-big-number";
import { getMarketAgeInDays } from "utils/format-date";

const mapStateToProps = (state: any, ownProps: any) => {
  const {
    currentTimestamp
  } = state;
  const market = selectMarket(ownProps.marketId);
  const daysPassed =
    market &&
    market.creationTime &&
    getMarketAgeInDays(market.creationTime.timestamp, currentTimestamp);

  return {
    currentTimestamp,
    daysPassed,
    minPrice: market.minPrice || createBigNumber(0),
    maxPrice: market.maxPrice || createBigNumber(0),
  };
};


const MarketChartsPaneContainer = withRouter(
  connect(
    mapStateToProps
  )(MarketChartsPane)
);

export default MarketChartsPaneContainer;
