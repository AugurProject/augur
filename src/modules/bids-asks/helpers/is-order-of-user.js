import memoize from 'memoizee'

/**
 * @type {Function}
 */
export const isOrderOfUser = memoize((order, userAddress) => (
  userAddress != null && order.owner === userAddress
), { max: 10 })
