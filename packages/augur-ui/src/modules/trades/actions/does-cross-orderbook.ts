import { BUY, ASKS, BIDS } from 'modules/common/constants';

// user's order price needs to not match existing order
// this isn't done in simulate trade because of cross orders are filtered out of the orderbook
// but still exist in the orders db
export const doesCrossOrderbook = (price, side, orderBook): boolean => {
  const orderPrice = Number(price);
  if (side === BUY) {
    const asks = orderBook[ASKS];
    if (!asks || asks.length === 0) return true;

    const bestAsk = orderBook[ASKS].map(o => Number(o.price)).sort()[0];
    return orderPrice >= bestAsk;
  }
  const bids = orderBook[BIDS];
  if (!bids || bids.length === 0) return true;

  const bestBid = orderBook[BIDS].map(o => Number(o.price)).sort()[
    bids.length - 1
  ];
  return orderPrice <= bestBid;
};
