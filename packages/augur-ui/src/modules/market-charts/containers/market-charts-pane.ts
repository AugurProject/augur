import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketChartsPane from "modules/market-charts/components/market-charts-pane/market-charts-pane";
import { selectMarket } from "modules/markets/selectors/market";
import { getMarketAgeInDays } from "utils/format-date";
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { AppState } from "store";
import { ZERO } from "modules/common/constants";

const mapStateToProps = (state: AppState, ownProps: any) => {
  const currentTimestamp = selectCurrentTimestampInSeconds(state);
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const daysPassed =
    market &&
    market.creationTime &&
    getMarketAgeInDays(market.creationTime, currentTimestamp);

  return {
    currentTimestamp,
    daysPassed,
    minPrice: market.minPriceBigNumber || ZERO,
    maxPrice: market.maxPriceBigNumber || ZERO,
  };
};

const MarketChartsPaneContainer = withRouter(
  connect(
    mapStateToProps,
  )(MarketChartsPane),
);

export default MarketChartsPaneContainer;
