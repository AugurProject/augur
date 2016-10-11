/*
 * Author: priecint
 */
import memoizerific from 'memoizerific';
import BigNumber from 'bignumber.js';
import { ZERO } from '../../../trade/constants/numbers';

/**
 *
 */
export const calculateMaxPossibleShares = memoizerific(100)((loginAccount, limitPrice, totalFee, totalCost, gasFeesRealEth) => {
	if (loginAccount.id == null || limitPrice == null) {
		return null;
	}

	const userEther = new BigNumber(loginAccount.ether);
	if (userEther.eq(ZERO)) {
		return 0;
	}
	// console.log(`calculateMaxShares:(${loginAccount.ether} - ${totalFee} - ${totalCost} - ${gasFeesRealEth}) / ${limitPrice} = ${(loginAccount.ether - totalFee - totalCost - gasFeesRealEth) / limitPrice}`);

	return userEther
		.minus(new BigNumber(totalFee))
		.minus(new BigNumber(totalCost))
		.minus(new BigNumber(gasFeesRealEth))
		.dividedBy(new BigNumber(limitPrice))
		.toNumber();
});
