import { connect } from "react-redux";

import MarketOutcomesChartHighchart from "modules/market-charts/components/market-outcomes-chart/market-outcome-chart-highchart";

import { selectMarket } from "modules/markets/selectors/market";
import selectBucketedPriceTimeSeries from "modules/markets/selectors/select-bucketed-price-time-series";
import { createBigNumber } from "utils/create-big-number";

const mapStateToProps = (state, ownProps) => {
  const {
    maxPrice = createBigNumber(1),
    minPrice = createBigNumber(0),
    outcomes = [],
    isScalar,
    scalarDenomination
  } = selectMarket(ownProps.marketId);
  const bucketedPriceTimeSeries = selectBucketedPriceTimeSeries(
    ownProps.marketId
  );

  return {
    maxPrice: maxPrice.toNumber(),
    minPrice: minPrice.toNumber(),
    fixedPrecision: 4,
    pricePrecision: 4,
    outcomes,
    bucketedPriceTimeSeries,
    isScalar,
    scalarDenomination
  };
};

export default connect(mapStateToProps)(MarketOutcomesChartHighchart);
