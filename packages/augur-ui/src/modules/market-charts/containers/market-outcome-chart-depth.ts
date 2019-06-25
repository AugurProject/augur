import { connect } from 'react-redux';
import { isEmpty } from 'utils/is-populated';

import { createBigNumber } from 'utils/create-big-number';

import MarketOutcomeChartsDepth from 'modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth';

import orderAndAssignCumulativeShares from 'modules/markets/helpers/order-and-assign-cumulative-shares';
import orderForMarketDepth from 'modules/markets/helpers/order-for-market-depth';
import getOrderBookKeys from 'modules/markets/helpers/get-orderbook-keys';
import getPrecision from 'utils/get-number-precision';

import { selectMarket } from 'modules/markets/selectors/market';

import { ASKS, BIDS } from 'modules/common/constants';
import { selectCurrentTimestampInSeconds } from 'store/select-state';

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);
  if ( market === null) {
    return {
      isLoading: true
    }
  }
  const userOpenOrders = state.userOpenOrders[ownProps.marketId] || [];
  const outcomeOrderBook =
    state.orderBooks[ownProps.marketId] &&
    state.orderBooks[ownProps.marketId][ownProps.selectedOutcomeId];
  const minPrice = market.minPriceBigNumber || createBigNumber(0);
  const maxPrice = market.maxPriceBigNumber || createBigNumber(0);
  const marketOutcome =
    market.marketOutcomes.find(
      outcome => outcome.id === ownProps.selectedOutcomeId
    );
  const cumulativeOrderBook = orderAndAssignCumulativeShares(
    outcomeOrderBook,
    userOpenOrders,
    state.loginAccount.address
  );
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
