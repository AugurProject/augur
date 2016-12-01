import memoizerific from 'memoizerific';

/**
 * @type {Function}
 */
export const isOrderOfUser = memoizerific(10)((order, userAddress) => (
	userAddress != null && order.owner === userAddress
));
