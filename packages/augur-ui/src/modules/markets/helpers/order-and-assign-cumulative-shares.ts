import type { OutcomeOrderBook } from '@augurproject/sdk-lite';
import memoize from 'memoizee';
import { ASKS, BIDS } from 'modules/common/constants';
import { QuantityOutcomeOrderBook } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { calcPercentageFromPrice } from 'utils/format-number';

function calculateQuantityScale(outOfBN, sharesBN) {
  return createBigNumber(100).minus(
    sharesBN.dividedBy(outOfBN).times(createBigNumber(100))
  );
}

function calculateMaxValues(mostShares) {
  return (
    mostShares &&
    createBigNumber(mostShares).plus(
      createBigNumber(mostShares).times(createBigNumber(0.15))
    )
  );
}
export const orderAndAssignCumulativeShares = memoize(
  (orderBook: OutcomeOrderBook): QuantityOutcomeOrderBook => {
    if (!orderBook) {
      return { spread: null, bids: [], asks: [] };
    }

    const rawBids = ((orderBook || {})[BIDS] || []).slice();
    const rawAsks = ((orderBook || {})[ASKS] || []).slice();

    const mostBidShares = Math.max(
      ...rawBids.map(({ shares }) => createBigNumber(shares).toNumber())
    );
    const mostAskShares = Math.max(
      ...rawAsks.map(({ shares }) => createBigNumber(shares).toNumber())
    );
    const outOf = calculateMaxValues(Math.max(mostBidShares, mostAskShares));

    const bids = rawBids
      .map(({
        price,
        shares,
        cumulativeShares,
        mySize,
      }) => ({
        price,
        shares,
        quantityScale: calculateQuantityScale(
          outOf,
          createBigNumber(shares)
        ).toString(),
        cumulativeShares,
        mySize,
      }))
      .sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));

    const asks = rawAsks
      .map(({
        price,
        shares,
        cumulativeShares,
        mySize,
      }) => ({
        price,
        shares,
        quantityScale: calculateQuantityScale(
          outOf,
          createBigNumber(shares)
        ).toString(),
        cumulativeShares,
        mySize,
      }))
      .sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));

    return {
      spread: orderBook.spread,
      bids,
      asks,
    };
  }
);


export const calcOrderbookPercentages = memoize(
  (
    orderBook: QuantityOutcomeOrderBook,
    minPrice: string,
    maxPrice: string
  ): QuantityOutcomeOrderBook => {
    if (!orderBook) {
      return { spread: null, bids: [], asks: [] };
    }
    const bids =
      orderBook[BIDS] &&
      orderBook[BIDS].map(o => ({
        ...o,
        percent: calcPercentageFromPrice(o.price, minPrice, maxPrice),
      }));

    const asks =
      orderBook[ASKS] &&
      orderBook[ASKS].map(o => ({
        ...o,
        percent: calcPercentageFromPrice(o.price, minPrice, maxPrice),
      }));
      let spread = 0;
      const bestBid = Math.max(...bids.map(({ percent }) => percent));
      const bestAsk = Math.min(...asks.map(({ percent }) => percent));
      if (bestBid !== undefined && bestAsk !== undefined) {
        spread = bestAsk - bestBid;
      }
    return {
      spread: String(spread),
      bids,
      asks,
    };
  }
);
