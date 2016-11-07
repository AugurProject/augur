/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import BigNumber from 'bignumber.js';
import { ZERO } from '../constants/numbers';

/**
 * Returns true if user has enough funds for trades, false otherwise
 *
 * @param {Array} trades
 * @param {Object} loginAccount
 * @return {boolean}
 */
export default memoizerific(10)((trades, loginAccount) => {
	if (!loginAccount || loginAccount.id == null || loginAccount.ether == null) {
		return false;
	}

	const totalCost = trades.reduce((totalCost, trade) => (
        trade.side === 'buy' ?
            totalCost.plus(new BigNumber(trade.totalCost.value, 10)) :
            totalCost.plus(new BigNumber(trade.totalFee.value, 10))
    ), ZERO);
	return totalCost.lte(new BigNumber(loginAccount.ether, 10));
});
