import { connect } from "react-redux";
import { isEmpty } from "utils/is-empty";
import OrderBook from "modules/market-charts/components/order-book/order-book";
import { selectMarket } from "modules/markets/selectors/market";
import { selectCurrentTimestampInSeconds } from "store/select-state";
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { ASKS, BIDS } from "modules/common/constants";
import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import { AppState } from "store";

const mapStateToProps = (state: AppState, ownProps) => {
  const { orderBooks } = state;
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const orderBook = orderBooks && orderBooks[market.id] || { expirationTime: 0 };
  const selectedOutcomeId = (ownProps.selectedOutcomeId !== undefined && ownProps.selectedOutcomeId !== null) ? ownProps.selectedOutcomeId : market.defaultSelectedOutcomeId;
  const outcomeOrderBook = ownProps.orderBook || {};

  const outcome =
    (market.outcomesFormatted || []).find(
      (outcome) => outcome.id === selectedOutcomeId
    );

  return {
    expirationTime: ownProps.initialLiquidity || !!!orderBook ? 0 : orderBook.expirationTime,
    outcomeName: outcome && outcome.description,
    selectedOutcome: outcome,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    orderBook: orderAndAssignCumulativeShares(outcomeOrderBook),
    hasOrders:
      !isEmpty(orderBook[BIDS]) ||
      !isEmpty(orderBook[ASKS]),
    marketType: market.marketType,
    marketId: market.marketId,
    initialLiquidity: ownProps.initialLiquidity,
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
