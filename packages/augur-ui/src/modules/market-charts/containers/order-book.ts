import { connect } from "react-redux";
import { isEmpty } from "utils/is-empty";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import { selectMarket } from "modules/markets/selectors/market";
import { ASKS, BIDS, SCALAR, INVALID_OUTCOME_ID } from "modules/common/constants";
import { orderAndAssignCumulativeShares, calcOrderbookPercentages } from "modules/markets/helpers/order-and-assign-cumulative-shares";
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { AppState } from "appStore";
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from "modules/markets/store/markets-hooks";

const mapStateToProps = (state: AppState, ownProps) => {
  const { orderBooks } = Markets.get();
  const {zeroXStatus, blockchain: { currentAugurTimestamp }} = AppStatus.get();
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const selectedOutcomeId = (ownProps.selectedOutcomeId !== undefined && ownProps.selectedOutcomeId !== null) ? ownProps.selectedOutcomeId : market.defaultSelectedOutcomeId;
  const orderBook = orderBooks && orderBooks[market.id] || { expirationTime: 0 };
  const outcomeOrderBook = ownProps.orderBook || {};
  const usePercent = market.marketType === SCALAR && selectedOutcomeId === INVALID_OUTCOME_ID;

  const outcome =
    (market.outcomesFormatted || []).find(
      (outcome) => outcome.id === selectedOutcomeId
    );

  let processedOrderbook = orderAndAssignCumulativeShares(outcomeOrderBook);

  if (usePercent) {
    // calc percentages in orderbook
    processedOrderbook = calcOrderbookPercentages(processedOrderbook, market.minPrice, market.maxPrice);
  }

  return {
    expirationTime: ownProps.initialLiquidity || !!!orderBook ? 0 : orderBook.expirationTime,
    outcomeName: outcome && outcome.description,
    selectedOutcome: outcome,
    currentTimeInSeconds: currentAugurTimestamp,
    orderBook: processedOrderbook,
    hasOrders:
      !isEmpty(processedOrderbook[BIDS]) ||
      !isEmpty(processedOrderbook[ASKS]),
    marketType: market.marketType,
    marketId: market.marketId,
    initialLiquidity: ownProps.initialLiquidity,
    usePercent,
    status: zeroXStatus,
  };
};

const mapDispatchToProps = (dispatch) => ({
  loadMarketOrderBook: marketId => dispatch(loadMarketOrderBook(marketId)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {

  return {
    ...oP,
    ...sP,
    loadMarketOrderBook: () => dP.loadMarketOrderBook(sP.marketId),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(OrderBook);
