import { connect } from "react-redux";

import MarketOutcomesChartHighchart from "modules/market-charts/components/market-outcomes-chart/market-outcome-chart-highchart";

import { selectMarket } from "modules/markets/selectors/market";
import selectBucketedPriceTimeSeries from "modules/markets/selectors/select-bucketed-price-time-series";
import { SCALAR } from "modules/common/constants";

const mapStateToProps = (state, ownProps) => {
  const {
    maxPriceBigNumber,
    minPriceBigNumber,
    outcomes = [],
    marketType,
    scalarDenomination,
  } = ownProps.marketId ? selectMarket(ownProps.marketId) : ownProps.market;
  const isScalar = marketType === SCALAR;
  const bucketedPriceTimeSeries = selectBucketedPriceTimeSeries(
    ownProps.marketId,
  );

  return {
    maxPrice: maxPriceBigNumber.toNumber(),
    minPrice: minPriceBigNumber.toNumber(),
    fixedPrecision: 4,
    pricePrecision: 4,
    outcomes,
    bucketedPriceTimeSeries,
    isScalar,
    scalarDenomination,
  };
};

export default connect(mapStateToProps)(MarketOutcomesChartHighchart);
