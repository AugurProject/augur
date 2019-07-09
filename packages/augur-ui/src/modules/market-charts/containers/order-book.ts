import { connect } from "react-redux";
import { isEmpty } from "utils/is-populated";
import { createBigNumber } from "utils/create-big-number";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import orderForMarketDepth from "modules/markets/helpers/order-for-market-depth";
import getOrderBookKeys from "modules/markets/helpers/get-orderbook-keys";
import { selectMarket } from "modules/markets/selectors/market";
import { ASKS, BIDS } from "modules/common/constants";
import { selectCurrentTimestampInSeconds } from "store/select-state";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market;
  const outcomeOrderBook =
    ownProps.initialLiquidity ? market.orderBook[ownProps.selectedOutcomeId] : state.orderBooks[market.marketId] &&
    state.orderBooks[market.marketId][ownProps.selectedOutcomeId];
  const minPrice = market.minPriceBigNumber || createBigNumber(0);
  const maxPrice = market.maxPriceBigNumber || createBigNumber(0);
  const outcome =
    (market.outcomesFormatted || []).find(
      (outcome) => outcome.id === ownProps.selectedOutcomeId,
    );
  const cumulativeOrderBook = orderAndAssignCumulativeShares(
    outcomeOrderBook
  );

  const marketDepth = orderForMarketDepth(cumulativeOrderBook);
  const orderBookKeys = getOrderBookKeys(marketDepth, minPrice, maxPrice);
  console.log(outcomeOrderBook);
  console.log(cumulativeOrderBook);
  return {
    outcomeName: outcome.description,
    selectedOutcome: outcome,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: cumulativeOrderBook,
    hasOrders:
      !isEmpty(cumulativeOrderBook[BIDS]) ||
      !isEmpty(cumulativeOrderBook[ASKS]),
    marketMidpoint: orderBookKeys.mid,
    marketDepth,
    orderBookKeys,
    minPrice,
    maxPrice,
  };
};

export default connect(mapStateToProps)(OrderBook);
