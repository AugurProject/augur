import memoize from "memoizee";
import { createBigNumber } from "utils/create-big-number";
import { BIDS, ASKS } from "modules/common/constants";

function calculateQuantityScale(outOfBN, sharesBN) {
  return createBigNumber(100).minus(
    sharesBN
      .dividedBy(outOfBN)
      .times(createBigNumber(100))
  );
}

const orderAndAssignCumulativeShares = memoize(
  (orderBook) => {
    const rawBids = ((orderBook || {})[BIDS] || []).slice();
    const rawAsks = ((orderBook || {})[ASKS] || []).slice();
    const bidsAsksSort = rawBids
      .concat(rawAsks)
      .sort((a, b) => createBigNumber(b.shares).minus(createBigNumber(a.shares)));
    const mostShares =
      bidsAsksSort[0] && bidsAsksSort[0].shares && createBigNumber(bidsAsksSort[0].shares);
    const outOf =
      mostShares &&
      createBigNumber(mostShares).plus(
        createBigNumber(mostShares).times(createBigNumber(0.15))
      );
    const bids = rawBids.sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price))).reduce(
      (p, order) => [
        ...p,
        {
          price: order.price,
          shares: order.shares,
          quantityScale: calculateQuantityScale(
            outOf,
            createBigNumber(order.shares)
          ).toString(),
          cumulativeShares: order.cumulativeShares,
          mySize: order.mySize
        }
      ],
      []
    );

    const asks = rawAsks
      .sort((a, b) => createBigNumber(a.price).minus(createBigNumber(b.price)))
      .reduce(
        (p, order) => [
          ...p,
          {
            price: order.price,
            shares: order.shares,
            quantityScale: calculateQuantityScale(
              outOf,
              createBigNumber(order.shares)
            ).toString(),
            cumulativeShares: order.cumulativeShares,
            mySize: order.mySize
          }
        ],
        []
      )
      .sort((a, b) => createBigNumber(b.price).minus(createBigNumber(a.price)));

    return {
      bids,
      asks
    };
  }
);

export default orderAndAssignCumulativeShares;
