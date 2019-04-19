import { connect } from "react-redux";

import MarketOutcomesChartHighchart from "modules/market-charts/components/market-outcomes-chart/market-outcome-chart-highchart";

import { selectMarket } from "modules/markets/selectors/market";
import { selectCurrentTimestamp } from "src/select-state";
import { selectBucketedPriceTimeSeries } from "modules/markets/selectors/select-bucketed-price-time-series";
import { createBigNumber } from "src/utils/create-big-number";
import { convertUnixToFormattedDate } from "src/utils/format-date";

const mapStateToProps = (state, ownProps) => {
  const {
    creationTime = convertUnixToFormattedDate(),
    maxPrice = createBigNumber(1),
    minPrice = createBigNumber(0),
    outcomes = [],
    isScalar,
    scalarDenomination
  } = selectMarket(ownProps.marketId);

  const creationTimestamp = creationTime.value.getTime();
  const currentTimestamp = selectCurrentTimestamp(state) || Date.now();
  const bucketedPriceTimeSeries = selectBucketedPriceTimeSeries(
    creationTimestamp,
    currentTimestamp,
    outcomes
  );

  return {
    maxPrice: maxPrice.toNumber(),
    minPrice: minPrice.toNumber(),
    fixedPrecision: 4,
    outcomes,
    bucketedPriceTimeSeries,
    isScalar,
    scalarDenomination
  };
};

export default connect(mapStateToProps)(MarketOutcomesChartHighchart);
