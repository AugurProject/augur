import { connect } from 'react-redux';
import { isEmpty } from 'utils/is-populated';

import { createBigNumber } from 'utils/create-big-number';
import MarketOutcomeChartsDepth from 'modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth';
import orderAndAssignCumulativeShares from 'modules/markets/helpers/order-and-assign-cumulative-shares';
import orderForMarketDepth from 'modules/markets/helpers/order-for-market-depth';
import getOrderBookKeys from 'modules/markets/helpers/get-orderbook-keys';
import getPrecision from 'utils/get-number-precision';
import { selectMarket } from 'modules/markets/selectors/market';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { ASKS, BIDS } from "modules/common/constants";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.marketId ? selectMarket(ownProps.marketId) : ownProps.market;
  if ( market === null) {
    return {
      isLoading: true,
    };
  }

  const minPrice = createBigNumber(market.minPriceBigNumber) || createBigNumber(0);
  const maxPrice = createBigNumber(market.maxPriceBigNumber) || createBigNumber(0);
  const marketOutcome =
    market.outcomesFormatted.find(
      outcome => outcome.id === ownProps.selectedOutcomeId
    );

  let outcomeOrderBook =
    ownProps.initialLiquidity ? market.orderBook[ownProps.selectedOutcomeId] : state.orderBooks[market.marketId] &&
    state.orderBooks[market.marketId][ownProps.selectedOutcomeId];

  if (ownProps.initialLiquidity) {
    outcomeOrderBook = formatOrderBook(outcomeOrderBook);
  }

  const cumulativeOrderBook = orderAndAssignCumulativeShares(outcomeOrderBook);
  const marketDepth = orderForMarketDepth(cumulativeOrderBook);
  const orderBookKeys = getOrderBookKeys(marketDepth, minPrice, maxPrice);
  const pricePrecision = market && getPrecision(market.tickSize, 4);

  return {
    outcomeName: marketOutcome.description,
    selectedOutcome: marketOutcome,
    isMobile: state.appStatus.isMobile,
    isMobileSmall: state.appStatus.isMobileSmall,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: cumulativeOrderBook,
    hasOrders:
      !isEmpty(cumulativeOrderBook[BIDS]) ||
      !isEmpty(cumulativeOrderBook[ASKS]),
    pricePrecision,
    marketDepth,
    orderBookKeys,
    marketMin: minPrice,
    marketMax: maxPrice,
  };
};

export default connect(mapStateToProps)(MarketOutcomeChartsDepth);
