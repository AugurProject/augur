import memoize from 'memoizee';

import { BIDS, ASKS } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';

type BidAskShape = [string, string, string, boolean];

export interface MarketDepth {
  bids: BidAskShape[];
  asks: BidAskShape[];
}

export interface BidAsk {
  price: string;
  shares: string;
  cumulativeShares: string;
  quantityScale: string;
}

export interface OrderBookData {
  asks: [] | BidAsk[];
  bids: [] | BidAsk[];
  spread: null | string;
}

// The last entry in the order array is a boolean denoting whether the order is selectable or not.
const orderForMarketDepth = (orderBook: OrderBookData): MarketDepth => {
  const rawBids: BidAsk[] = ((orderBook || {})[BIDS] || []).slice();

  const bids: BidAskShape[] = rawBids.reduce(
    (p, order) => [
      ...p,
      [order.cumulativeShares, order.price, order.shares, true],
    ],
    []
  );

  const rawAsks: BidAsk[] = ((orderBook || {})[ASKS] || []).slice();

  const asks: BidAskShape[] = rawAsks
    .sort((a, b) =>
      createBigNumber(a.price)
        .minus(createBigNumber(b.price))
        .toNumber()
    )
    .reduce(
      (p, order) => [
        ...p,
        [order.cumulativeShares, order.price, order.shares, true],
      ],
      []
    );

  if (asks.length > 0) {
    const minAsksDepthOrder: BidAskShape = asks.reduce(
      (lastValue, nextValue) =>
        createBigNumber(lastValue[0] || 0).lte(createBigNumber(nextValue[0] || 0)) ? lastValue : nextValue,
      asks[0]
    );

    asks.unshift(['0', minAsksDepthOrder[1], minAsksDepthOrder[2], false]);
  }

  if (bids.length > 0) {
    const maxBidDepthOrder: BidAskShape = bids.reduce(
      (lastValue, nextValue) =>
        createBigNumber(lastValue[0] || 0).lte(createBigNumber(nextValue[0] || 0)) ? lastValue : nextValue,
      bids[0]
    );
    bids.unshift(['0', maxBidDepthOrder[1], maxBidDepthOrder[2], false]);
  }

  return {
    [BIDS]: bids,
    [ASKS]: asks,
  };
};

export default memoize(orderForMarketDepth);
