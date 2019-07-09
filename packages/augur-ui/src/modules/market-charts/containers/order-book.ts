import { connect } from "react-redux";
import { isEmpty } from "utils/is-populated";
import { createBigNumber } from "utils/create-big-number";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import orderForMarketDepth from "modules/markets/helpers/order-for-market-depth";
import getOrderBookKeys from "modules/markets/helpers/get-orderbook-keys";
import { selectMarket } from "modules/markets/selectors/market";
import { ASKS, BIDS, BUY, SELL } from "modules/common/constants";
import { selectCurrentTimestampInSeconds } from "store/select-state";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  let outcomeOrderBook =
    ownProps.initialLiquidity ? market.orderBook[ownProps.selectedOutcomeId] : state.orderBooks[market.marketId] &&
    state.orderBooks[market.marketId][ownProps.selectedOutcomeId];

  if (ownProps.initialLiquidity) {
    const bids = (outcomeOrderBook || []).filter(order => order.type === SELL)
    const asks = (outcomeOrderBook || []).filter(order => order.type === BUY)
    outcomeOrderBook = {};
    outcomeOrderBook[ASKS] = asks;
    outcomeOrderBook[BIDS] = bids;
  }
  const minPrice = market.minPriceBigNumber || createBigNumber(0);
  const maxPrice = market.maxPriceBigNumber || createBigNumber(0);
  const outcome =
    (market.outcomesFormatted || []).find(
      (outcome) => outcome.id === ownProps.selectedOutcomeId,
    );
  console.log(outcomeOrderBook);

  const cumulativeOrderBook = orderAndAssignCumulativeShares(
    outcomeOrderBook
  );

  return {
    outcomeName: outcome.description,
    selectedOutcome: outcome,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: cumulativeOrderBook,
    hasOrders:
      !isEmpty(cumulativeOrderBook[BIDS]) ||
      !isEmpty(cumulativeOrderBook[ASKS]),
    minPrice,
    maxPrice,
  };
};

export default connect(mapStateToProps)(OrderBook);
