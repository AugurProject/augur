/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import BigNumber from 'bignumber.js';
import { ZERO } from '../../../trade/constants/numbers';
import { augur } from '../../../../services/augurjs';

/**
 * Orders should be sorted from best to worst (usually by price)
 *
 * @param loginAccount {Object}
 * @param orders {Array}
 */
export const calculateMaxPossibleShares = memoizerific(100)((loginAccount, orders, makerFee, takerFee, range) => {
	if (loginAccount.id == null) {
		return null;
	}

	const userEther = new BigNumber(loginAccount.ether);
	if (userEther.eq(ZERO)) {
		return '0';
	}

	const ordersLength = orders.length;
	const { tradingFee, makerProportionOfFee } = augur.calculateFxpTradingFees(new BigNumber(makerFee, 10), new BigNumber(takerFee, 10));
	let runningCost = ZERO;
	let maxPossibleShares = ZERO;
	for (let i = 0, order; i < ordersLength; i++) {
		order = orders[i];
		const orderAmount = new BigNumber(order.amount, 10);
		const orderCost = augur.calculateFxpTradingCost(orderAmount, new BigNumber(order.price, 10), tradingFee, makerProportionOfFee, range).cost;
		runningCost = runningCost.plus(orderCost);

		if (runningCost.lte(userEther)) {
			maxPossibleShares = maxPossibleShares.plus(orderAmount);
		} else {
			break;
		}
	}

	return maxPossibleShares.toString();
});
