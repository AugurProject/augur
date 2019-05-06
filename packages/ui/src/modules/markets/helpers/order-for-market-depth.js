import memoize from "memoizee";

import { BIDS, ASKS } from "modules/common-elements/constants";
import { createBigNumber } from "src/utils/create-big-number";

// The last entry in the order array is a boolean denoting whether the order is selectable or not.
const orderForMarketDepth = orderBook => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice();
  const bids = rawBids.reduce(
    (p, order) => [
      ...p,
      [order.cumulativeShares, order.price.value, order.shares.value, true]
    ],
    []
  );
  const rawAsks = ((orderBook || {})[ASKS] || []).slice();
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce(
      (p, order) => [
        ...p,
        [order.cumulativeShares, order.price.value, order.shares.value, true]
      ],
      []
    );

  if (asks.length > 0) {
    const minAsksDepthOrder = asks.reduce(
      (lastValue, nextValue) =>
        lastValue[0].lte(nextValue[0]) ? lastValue : nextValue,
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
        lastValue[0].lte(nextValue[0]) ? lastValue : nextValue,
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
