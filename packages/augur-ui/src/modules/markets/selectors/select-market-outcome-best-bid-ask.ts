import { formatNone, formatBestPrice, formatMarketShares } from 'utils/format-number';
import memoize from 'memoizee';
import { YES_NO } from 'modules/common/constants';

export const selectMarketOutcomeBestBidAsk = memoize(
  (orderBook, marketType = YES_NO, tickSize = 0) => {
    const none = { price: formatNone(), shares: formatNone() };
    let topAsk = none;
    let topBid = none;

    const formatData = item => {
      return {
        price: formatBestPrice(item.price, tickSize),
        shares: formatMarketShares(marketType, item.shares),
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
  },
  { max: 1 }
);

