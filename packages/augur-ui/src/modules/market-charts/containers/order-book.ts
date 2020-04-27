import { connect } from "react-redux";
import { isEmpty } from "utils/is-empty";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import { selectMarket } from "modules/markets/selectors/market";
import { selectCurrentTimestampInSeconds } from "appStore/select-state";
import { ASKS, BIDS, SCALAR, INVALID_OUTCOME_ID } from "modules/common/constants";
import { orderAndAssignCumulativeShares, calcOrderbookPercentages } from "modules/markets/helpers/order-and-assign-cumulative-shares";
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { AppState } from "appStore";
import { Ox_STATUS } from "modules/app/actions/update-app-status";

const mapStateToProps = (state: AppState, ownProps) => {
  const { orderBooks, appStatus } = state;
  const zeroXStatus = appStatus[Ox_STATUS];
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const orderBook = orderBooks && orderBooks[market.id] || { expirationTime: 0 };
  const selectedOutcomeId = (ownProps.selectedOutcomeId !== undefined && ownProps.selectedOutcomeId !== null) ? ownProps.selectedOutcomeId : market.defaultSelectedOutcomeId;
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
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
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
