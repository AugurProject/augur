import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { createBigNumber } from "utils/create-big-number";

import OrderBook from "modules/market-charts/components/order-book/order-book";

import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import orderForMarketDepth from "modules/markets/helpers/order-for-market-depth";
import getOrderBookKeys from "modules/markets/helpers/get-orderbook-keys";

import { selectMarket } from "modules/markets/selectors/market";

import { ASKS, BIDS } from "modules/common-elements/constants";
import { selectCurrentTimestampInSeconds } from "store/select-state";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);
  const userOrders =
    state.orderBooks[ownProps.marketId] &&
    state.orderBooks[ownProps.marketId][ownProps.selectedOutcome];
  const minPrice = market.minPrice || createBigNumber(0);
  const maxPrice = market.maxPrice || createBigNumber(0);
  const outcome =
    (market.outcomes || []).find(
      outcome => outcome.id === ownProps.selectedOutcome
    ) || {};
  const cumulativeOrderBook = orderAndAssignCumulativeShares(
    outcome.orderBook,
    userOrders,
    state.loginAccount.address
  );

  const marketDepth = orderForMarketDepth(cumulativeOrderBook);
  const orderBookKeys = getOrderBookKeys(marketDepth, minPrice, maxPrice);
  return {
    outcomeName: outcome.name,
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
    maxPrice
  };
};

export default connect(mapStateToProps)(OrderBook);
