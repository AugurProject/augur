import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MarketChartsPane from "modules/market-charts/components/market-charts-pane/market-charts-pane";
import { selectMarket } from "modules/markets/selectors/market";
import { getMarketAgeInDays } from "utils/format-date";
import { AppState } from "appStore";
import { ZERO } from "modules/common/constants";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState, ownProps: any) => {
  const currentTimestamp = AppStatus.get().blockchain.currentAugurTimestamp;
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
    orderBook: ownProps.orderBook,
  };
};

const MarketChartsPaneContainer = withRouter(
  connect(
    mapStateToProps,
  )(MarketChartsPane),
);

export default MarketChartsPaneContainer;
