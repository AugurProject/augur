/*
 * Author: priecint
 */
import { assert } from 'chai';

describe('modules/market/selectors/helpers/calculate-max-possible-shares.js', () => {
	const { calculateMaxPossibleShares } = require('../../../../src/modules/market/selectors/helpers/calculate-max-possible-shares');

	const testCases = [
		{
			loginAccount: {},
			makerFee: '0.001000000000000000006', // from real market
			takerFee: '0.019999999999999999994',
			cumulativeScale: '1',
			orders: [],
			result: null
		},
		{
			loginAccount: { id: 'address', ether: 0 },
			makerFee: '0.001000000000000000006',
			takerFee: '0.019999999999999999994',
			cumulativeScale: '1',
			orders: [
				{
					amount: '10',
					block: 1234,
					id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
					price: '0.42',
					type: 'buy'
				},
				{
					amount: '10',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0xtest123',
					price: '0.44',
					type: 'buy'
				}
			],
			result: '0'
		},
		{
			loginAccount: { id: 'address', ether: 5 },
			makerFee: '0.001000000000000000006',
			takerFee: '0.019999999999999999994',
			cumulativeScale: '1',
			orders: [
				{
					amount: '1',
					block: 1234,
					id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
					price: '1',
					type: 'buy'
				},
				{
					amount: '2',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0xtest123',
					price: '2',
					type: 'buy'
				},
				{
					amount: '3',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0xtest123',
					price: '3',
					type: 'buy'
				}
			],
			result: '3'
		},
		{
			loginAccount: { id: 'address', ether: 9 },
			makerFee: '0.001000000000000000006',
			takerFee: '0.019999999999999999994',
			cumulativeScale: '1',
			orders: [
				{
					amount: '1',
					block: 1234,
					id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
					price: '1',
					type: 'buy'
				},
				{
					amount: '2',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0xtest123',
					price: '2',
					type: 'buy'
				},
				{
					amount: '3',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0xtest123',
					price: '3',
					type: 'buy'
				}
			],
			result: '3'
		}
	];
	testCases.forEach((test) => {
		it(`calculateMaxPossibleShares(${JSON.stringify(test)})`, () => {
			assert.strictEqual(calculateMaxPossibleShares(test.loginAccount, test.orders, test.makerFee, test.takerFee, test.cumulativeScale, {}), test.result);
		});
	});
});
