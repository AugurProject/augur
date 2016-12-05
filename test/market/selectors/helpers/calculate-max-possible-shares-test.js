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
			loginAccount: { address: 'address', ether: 0 },
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
					fullPrecisionPrice: '0.42',
					type: 'buy'
				},
				{
					amount: '10',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.44',
					fullPrecisionPrice: '0.44',
					type: 'buy'
				}
			],
			result: '0'
		},
		{
			loginAccount: { address: 'address', ether: 5 },
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
					price: '0.1',
					fullPrecisionPrice: '0.1',
					type: 'buy'
				},
				{
					amount: '2',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.2',
					fullPrecisionPrice: '0.2',
					type: 'buy'
				},
				{
					amount: '3',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.3',
					fullPrecisionPrice: '0.3',
					type: 'buy'
				}
			],
			result: '6'
		},
		{
			loginAccount: { address: 'address', ether: 9 },
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
					price: '0.1',
					fullPrecisionPrice: '0.1',
					type: 'buy'
				},
				{
					amount: '2',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.2',
					fullPrecisionPrice: '0.2',
					type: 'buy'
				},
				{
					amount: '3',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.3',
					fullPrecisionPrice: '0.3',
					type: 'buy'
				}
			],
			result: '6'
		},
		{
			loginAccount: { address: 'address', ether: '0.001' },
			makerFee: '0.01',
			takerFee: '0.02',
			cumulativeScale: '1',
			orders: [
				{
					amount: '1',
					block: 1234,
					id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
					price: '0.1',
					fullPrecisionPrice: '0.1',
					type: 'buy'
				},
				{
					amount: '2',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.2',
					fullPrecisionPrice: '0.2',
					type: 'buy'
				},
				{
					amount: '3',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.3',
					fullPrecisionPrice: '0.3',
					type: 'buy'
				}
			],
			result: '1.109375'
		},

		{
			loginAccount: { address: 'address', ether: 5 },
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
					price: '0.1',
					fullPrecisionPrice: '0.1',
					type: 'sell'
				},
				{
					amount: '20',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.2',
					fullPrecisionPrice: '0.2',
					type: 'sell'
				},
				{
					amount: '30',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.3',
					fullPrecisionPrice: '0.3',
					type: 'sell'
				}
			],
			result: '29.711690363349131121'
		},
		{
			loginAccount: { address: 'address', ether: 9 },
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
					price: '0.1',
					fullPrecisionPrice: '0.1',
					type: 'sell'
				},
				{
					amount: '20',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.2',
					fullPrecisionPrice: '0.2',
					type: 'sell'
				},
				{
					amount: '30',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.3',
					fullPrecisionPrice: '0.3',
					type: 'sell'
				}
			],
			result: '42.921584054550222921'
		},
		{
			loginAccount: { address: 'address', ether: 100 },
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
					price: '0.1',
					fullPrecisionPrice: '0.1',
					type: 'sell'
				},
				{
					amount: '20',
					block: 1234,
					id: 'order2',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.2',
					fullPrecisionPrice: '0.2',
					type: 'sell'
				},
				{
					amount: '30',
					block: 1234,
					id: 'order3',
					market: 'testMarketID',
					outcome: '2',
					owner: '0x0000000000000000000000000000000000000001',
					price: '0.3',
					fullPrecisionPrice: '0.3',
					type: 'sell'
				}
			],
			result: '60'
		}
	];
	testCases.forEach((test) => {
		it(`calculateMaxPossibleShares(${JSON.stringify(test)})`, () => {
			assert.strictEqual(calculateMaxPossibleShares(test.loginAccount, test.orders, test.makerFee, test.takerFee, test.cumulativeScale, {}, null), test.result);
		});
	});
});
