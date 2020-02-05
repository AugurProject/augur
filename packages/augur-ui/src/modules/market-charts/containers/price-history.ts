import { connect } from "react-redux";

import PriceHistory from "modules/market-charts/components/price-history/price-history";

import { selectMarket } from "modules/markets/selectors/market";
import selectBucketedPriceTimeSeries from "modules/markets/selectors/select-bucketed-price-time-series";
import { SCALAR, TRADING_TUTORIAL } from "modules/common/constants";

const mapStateToProps = (state, ownProps) => {
  const isTradingTutorial = ownProps.marketId === TRADING_TUTORIAL;
  const {
    maxPriceBigNumber,
    minPriceBigNumber,
    outcomes = [],
    marketType,
    scalarDenomination,
  } = ownProps.marketId && !isTradingTutorial ? selectMarket(ownProps.marketId) : ownProps.market;
  const isScalar = marketType === SCALAR;

  const bucketedPriceTimeSeries = !isTradingTutorial ? selectBucketedPriceTimeSeries(ownProps.marketId) : {};

  return {
    maxPrice: !isTradingTutorial ? maxPriceBigNumber.toNumber() : 0,
    minPrice: !isTradingTutorial ? minPriceBigNumber.toNumber() : 0,
    fixedPrecision: 4,
    pricePrecision: 4,
    outcomes,
    bucketedPriceTimeSeries,
    isScalar,
    scalarDenomination,
    isTradingTutorial,
  };
};

export default connect(mapStateToProps)(PriceHistory);
