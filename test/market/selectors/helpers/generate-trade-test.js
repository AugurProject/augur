/*
 * Author: priecint
 */
import { assert } from 'chai';
import mocks from '../../../mockStore'

describe('modules/market/selectors/helpers/generate-trade.js', () => {
	const { state } = mocks;
	const { generateTrade } = require('../../../../src/modules/market/selectors/helpers/generate-trade');

	it(`should generate trade object`, () => {
		const trade = generateTrade(state.marketsData.testMarketID, state.outcomesData.testMarketID['1'], state.tradesInProgress.testMarketID, state.loginAccount, state.orderBooks.testMarketID);
		assert.deepEqual(trade, {
				'gasFeesRealEth': {
					'denomination': '',
					'formatted': '',
					'formattedValue': 0,
					'full': '',
					'minimized': '',
					'rounded': '',
					'roundedValue': 0,
					'value': 0
				},
				'limitPrice': 100,
				'maxNumShares': {
					'denomination': ' shares',
					'formatted': '0',
					'formattedValue': 0,
					'full': '0 shares',
					'minimized': '0',
					'rounded': '0.00',
					'roundedValue': 0,
					'value': 0
				},
				'numShares': 5000,
				'side': 'buy',
				'totalCost': {
					'denomination': ' ETH',
					'formatted': '50.0000',
					'formattedValue': 50,
					'full': '50.0000 ETH',
					'minimized': '50',
					'rounded': '50.0000',
					'roundedValue': 50,
					'value': 50
				},
				'totalFee': {
					'denomination': '',
					'formatted': '',
					'formattedValue': 0,
					'full': '',
					'minimized': '',
					'rounded': '',
					'roundedValue': 0,
					'value': 0
				},
				'tradeSummary': {
					'totalGas': {
						'denomination': ' real ETH',
						'formatted': '0',
						'formattedValue': 0,
						'full': '0 real ETH',
						'minimized': '0',
						'rounded': '0.0000',
						'roundedValue': 0,
						'value': 0
					},
					'tradeOrders': []
				},
				'tradeTypeOptions': [
					{
						'label': 'buy',
						'value': 'buy'
					},
					{
						'label': 'sell',
						'value': 'sell'
					}
				],
				updateTradeOrder: trade.updateTradeOrder // self reference for function
			}
		);
		assert.isFunction(trade.updateTradeOrder);

	});
});
