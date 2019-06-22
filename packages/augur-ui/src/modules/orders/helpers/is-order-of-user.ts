import memoize from "memoizee";

/**
 * @type {Function}
 */
export const isOrderOfUser = memoize(
  (order, userAddress) => userAddress != null && order.owner.toLowerCase() === userAddress.toLowerCase(),
  { max: 10 },
);
