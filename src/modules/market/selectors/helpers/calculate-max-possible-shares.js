/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import BigNumber from 'bignumber.js';
import { ZERO } from '../../../trade/constants/numbers';

/**
 * Orders should be sorted from best to worst (usually by price)
 *
 * @param loginAccount {Object}
 * @param orders {Array}
 */
export const calculateMaxPossibleShares = memoizerific(100)((loginAccount, orders) => {
	if (loginAccount.id == null) {
		return null;
	}

	const userEther = new BigNumber(loginAccount.ether);
	if (userEther.eq(ZERO)) {
		return 0;
	}

	const ordersLength = orders.length;

	let runningCost = ZERO;
	let maxPossibleShares = ZERO;
	for (let i = 0, order; i < ordersLength; i++) {
		order = orders[i];
		const orderCost = new BigNumber(order.amount, 10).times(new BigNumber(order.price, 10)); // todo: is this cost correct? what about fees?
		runningCost = runningCost.plus(orderCost);

		if (runningCost.lte(userEther)) {
			maxPossibleShares = maxPossibleShares.plus(order.amount);
		} else {
			break;
		}
	}

	return maxPossibleShares.toNumber();
});
