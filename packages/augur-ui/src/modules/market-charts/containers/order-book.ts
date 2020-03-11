import { connect } from "react-redux";
import { isEmpty } from "utils/is-empty";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import { selectMarket } from "modules/markets/selectors/market";
import { selectCurrentTimestampInSeconds } from "store/select-state";
import { ASKS, BIDS, SCALAR, INVALID_OUTCOME_ID } from "modules/common/constants";
import { orderAndAssignCumulativeShares, calcOrderbookPercentages } from "modules/markets/helpers/order-and-assign-cumulative-shares";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const selectedOutcomeId = (ownProps.selectedOutcomeId !== undefined && ownProps.selectedOutcomeId !== null) ? ownProps.selectedOutcomeId : market.defaultSelectedOutcomeId;
  const orderBook = ownProps.orderBook;

  const outcome =
    (market.outcomesFormatted || []).find(
      (outcome) => outcome.id === selectedOutcomeId
    );
  let processedOrderbook = orderAndAssignCumulativeShares(orderBook),
  const usePercent = market.marketType === SCALAR && selectedOutcomeId === INVALID_OUTCOME_ID;
  if (usePercent) {
    // calc percentages in orderbook
    processedOrderbook = calcOrderbookPercentages(processedOrderbook, market.minPrice, market.maxPrice);
  }
  return {
    outcomeName: outcome && outcome.description,
    selectedOutcome: outcome,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: processedOrderbook,
    hasOrders:
      !isEmpty(orderBook[BIDS]) ||
      !isEmpty(orderBook[ASKS]),
    marketType: market.marketType,
    marketId: market.marketId,
    initialLiquidity: ownProps.initialLiquidity,
    usePercent
  };
};

export default connect(mapStateToProps)(OrderBook);
