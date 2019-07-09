import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';
import { BIDS, ASKS } from 'modules/common/constants';

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
const orderAndAssignCumulativeShares = memoize(orderBook => {
  if (!orderBook) {
    return { spread: null, bids: [], asks: [] };
  }

  const rawBids = ((orderBook || {})[BIDS] || []).slice();
  const rawAsks = ((orderBook || {})[ASKS] || []).slice();

  const mostBidShares = Math.max(
    ...rawBids.map(bid => createBigNumber(bid.shares).toNumber())
  );
  const mostAskShares = Math.max(
    ...rawAsks.map(ask => createBigNumber(ask.shares).toNumber())
  );
  const outOf = calculateMaxValues(Math.max(mostBidShares, mostAskShares));

  const bids = rawBids
    .map(order => ({
      price: order.price,
      shares: order.shares,
      quantityScale: calculateQuantityScale(
        outOf,
        createBigNumber(order.shares)
      ).toString(),
      cumulativeShares: order.cumulativeShares,
      mySize: order.mySize,
    }))
    .sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));

  const asks = rawAsks
    .map(order => ({
      price: order.price,
      shares: order.shares,
      quantityScale: calculateQuantityScale(
        outOf,
        createBigNumber(order.shares)
      ).toString(),
      cumulativeShares: order.cumulativeShares,
      mySize: order.mySize,
    }))
    .sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));

  return {
    spread: orderBook.spread,
    bids,
    asks,
  };
});

export default orderAndAssignCumulativeShares;
