import { formatNone, formatShares, formatDai } from 'utils/format-number';

export const selectMarketOutcomeBestBidAsk = orderBook => {
  const none = { price: formatNone(), shares: formatNone() };
  let topAsk = none;
  let topBid = none;

  const formatData = item => {
    return {
      price: formatDai(item.price),
      shares: formatShares(item.shares, {decimals: 2, decimalsRounded: 2}),
    };
  };

  if (orderBook) {
    topAsk =
      orderBook.asks && orderBook.asks.length > 0
        ? orderBook.asks
            // Ascending order for asks
            .sort((a, b) => Number(a.price) - Number(b.price))
            .map(item => formatData(item))
            .shift()
        : topAsk;

    topBid =
      orderBook.bids && orderBook.bids.length > 0
        ? orderBook.bids
            // Decreasing order for bids
            .sort((a, b) => Number(b.price) - Number(a.price))
            .map(item => formatData(item))
            .shift()
        : topBid;
  }

  return {
    topAsk,
    topBid,
  };
};
