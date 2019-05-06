import { connect } from "react-redux";

import { createBigNumber } from "utils/create-big-number";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import MarketOutcomeCharts from "modules/market-charts/components/market-outcome-charts/market-outcome-charts";
import orderAndAssignCumulativeShares from "modules/markets/helpers/order-and-assign-cumulative-shares";
import orderForMarketDepth from "modules/markets/helpers/order-for-market-depth";
import getOrderBookKeys from "modules/markets/helpers/get-orderbook-keys";

import { formatEther, formatShares } from "utils/format-number";

import { SCALAR, BID, BIDS, ASKS } from "modules/common-elements/constants";

const mapStateToProps = (state, ownProps) => {
  const { newMarket, loginAccount } = state;

  const selectedOutcome = ownProps.selectedOutcome.toString();
  const orderBook = formatOrderbook(newMarket.orderBook[selectedOutcome] || []);
  const cumulativeOrderBook = orderAndAssignCumulativeShares(
    orderBook,
    null,
    loginAccount.address
  );
  const marketDepth = orderForMarketDepth(cumulativeOrderBook);
  const orderBookKeys = getOrderBookKeys(
    marketDepth,
    newMarket.type === SCALAR
      ? createBigNumber(newMarket.scalarSmallNum)
      : createBigNumber(0),
    newMarket.type === SCALAR
      ? createBigNumber(newMarket.scalarBigNum)
      : createBigNumber(1)
  );
  const hasOrders =
    !!cumulativeOrderBook[BIDS].length || !!cumulativeOrderBook[ASKS].length;

  return {
    isMobile: state.appStatus.isMobile,
    currentTimeInSeconds: selectCurrentTimestampInSeconds(state),
    fixedPrecision: 4,
    pricePrecision: 4,
    minPrice:
      newMarket.type === SCALAR
        ? createBigNumber(newMarket.scalarSmallNum)
        : createBigNumber(0),
    maxPrice:
      newMarket.type === SCALAR
        ? createBigNumber(newMarket.scalarBigNum)
        : createBigNumber(1),
    orderBook: cumulativeOrderBook,
    orderBookKeys,
    marketDepth,
    selectedOutcome: {
      id: selectedOutcome
    },
    hasOrders
  };
};

export default connect(mapStateToProps)(MarketOutcomeCharts);

function formatOrderbook(rawOrderbook = []) {
  return rawOrderbook.reduce(
    (p, order) => ({
      ...p,
      [order.type === BID ? BIDS : ASKS]: [
        ...p[order.type === BID ? BIDS : ASKS],
        {
          price: formatEther(order.price.toNumber()),
          shares: formatShares(order.quantity.toNumber())
        }
      ]
    }),
    {
      [BIDS]: [],
      [ASKS]: []
    }
  );
}
