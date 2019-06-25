import memoize from "memoizee";

import { BIDS, ASKS } from "modules/common/constants";
import { createBigNumber } from "utils/create-big-number";

// The last entry in the order array is a boolean denoting whether the order is selectable or not.
const orderForMarketDepth = orderBook => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice();
  const bids = rawBids.reduce(
    (p, order) => [
      ...p,
      [order.cumulativeShares, order.price, order.shares, true]
    ],
    []
  );
  const rawAsks = ((orderBook || {})[ASKS] || []).slice();
  const asks = rawAsks
    .sort((a, b) => createBigNumber(a.price).minus(createBigNumber(b.price)))
    .reduce(
      (p, order) => [
        ...p,
        [order.cumulativeShares, order.price, order.shares, true]
      ],
      []
    );

  if (asks.length > 0) {
    const minAsksDepthOrder = asks.reduce(
      (lastValue, nextValue) =>
        createBigNumber(lastValue[0]).lte(createBigNumber(nextValue[0])) ? lastValue : nextValue,
      asks[0]
    );
    asks.unshift([
      createBigNumber(0),
      minAsksDepthOrder[1],
      minAsksDepthOrder[2],
      false
    ]);
  }

  if (bids.length > 0) {
    const minBidDepthOrder = bids.reduce(
      (lastValue, nextValue) =>
        createBigNumber(lastValue[0]).gte(createBigNumber(nextValue[0])) ? lastValue : nextValue,
      bids[0]
    );
    bids.unshift([
      createBigNumber(0),
      minBidDepthOrder[1],
      minBidDepthOrder[2],
      false
    ]);
  }

  return {
    [BIDS]: bids,
    [ASKS]: asks
  };
};

export default memoize(orderForMarketDepth);
