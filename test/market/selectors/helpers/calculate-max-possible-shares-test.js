/*
 * Author: priecint
 */
import { assert } from 'chai';

describe('modules/market/selectors/helpers/calculate-max-possible-shares.js', () => {
	const { calculateMaxPossibleShares } = require('../../../../src/modules/market/selectors/helpers/calculate-max-possible-shares');

	const testCases = [
		{
			loginAccount: {},
			limitPrice: 0.5,
			totalFee: 0.5,
			totalCost: 0.6,
			gasFeesRealEth: 0.4,
			result: null
		},
		{
			loginAccount: { id: 'address', ether: 0 },
			limitPrice: 0.5,
			totalFee: 0.5,
			totalCost: 0.6,
			gasFeesRealEth: 0.4,
			result: 0
		},
		{
			loginAccount: { id: 'address', ether: 10 },
			limitPrice: 0.5,
			totalFee: 0.5,
			totalCost: 0.6,
			gasFeesRealEth: 0.4,
			result: 17
		},
		{
			loginAccount: { id: 'address', ether: 10 },
			limitPrice: null,
			totalFee: 0.5,
			totalCost: 0.6,
			gasFeesRealEth: 0.4,
			result: null
		},
		{
			loginAccount: { id: 'address', ether: 10 },
			limitPrice: 0.8,
			totalFee: 0,
			totalCost: 0,
			gasFeesRealEth: 0.4,
			result: 12
		}
	];
	testCases.forEach((test) => {
		it(`calculateMaxPossibleShares(${JSON.stringify(test)})`, () => {
			assert(
				calculateMaxPossibleShares(test.loginAccount, test.limitPrice, test.totalFee, test.totalCost, test.gasFeesRealEth) === test.result,
				`(${test.loginAccount.ether} - ${test.totalFee} - ${test.totalCost} - ${test.gasFeesRealEth}) / ${test.limitPrice} !== ${test.result}`);
		});
	});
});
