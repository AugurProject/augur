import { connect } from "react-redux";
import { isEmpty } from "utils/is-empty";
import { createBigNumber } from "utils/create-big-number";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import { selectMarket } from "modules/markets/selectors/market";
import { selectCurrentTimestampInSeconds } from "store/select-state";
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { ASKS, BIDS, ZERO } from "modules/common/constants";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const selectedOutcomeId = (ownProps.selectedOutcomeId !== undefined && ownProps.selectedOutcomeId !== null) ? ownProps.selectedOutcomeId : market.defaultSelectedOutcomeId;

  let outcomeOrderBook =
    ownProps.initialLiquidity ? market.orderBook[selectedOutcomeId] : state.orderBooks[market.marketId] &&
    state.orderBooks[market.marketId][selectedOutcomeId];

  const minPrice = createBigNumber(market.minPriceBigNumber) || ZERO;
  const maxPrice = createBigNumber(market.maxPriceBigNumber) || ZERO;

  if (ownProps.initialLiquidity) {
    outcomeOrderBook = formatOrderBook(outcomeOrderBook);
  }

  const outcome =
    (market.outcomesFormatted || []).find(
      (outcome) => outcome.id === selectedOutcomeId
    );

  const cumulativeOrderBook = orderAndAssignCumulativeShares(
    outcomeOrderBook
  );

  return {
    outcomeName: outcome && outcome.description,
    selectedOutcome: outcome,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: cumulativeOrderBook,
    hasOrders:
      !isEmpty(cumulativeOrderBook[BIDS]) ||
      !isEmpty(cumulativeOrderBook[ASKS]),
    minPrice,
    maxPrice,
    marketType: market.marketType,
  };
};

export default connect(mapStateToProps)(OrderBook);
