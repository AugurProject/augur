import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { createBigNumber } from "utils/create-big-number";

import MarketOutcomeChartsDepth from "modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth";

import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import orderForMarketDepth from "modules/markets/helpers/order-for-market-depth";
import getOrderBookKeys from "modules/markets/helpers/get-orderbook-keys";
import getPrecision from "utils/get-number-precision";

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
  const pricePrecision = market && getPrecision(market.tickSize, 4);

  return {
    outcomeName: outcome.name,
    selectedOutcome: outcome,
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
    marketMax: maxPrice
  };
};

export default connect(mapStateToProps)(MarketOutcomeChartsDepth);
