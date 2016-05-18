import {
	assert
} from 'chai';
import * as action from '../../../src/modules/markets/actions/update-markets-data';

describe(`modules/markets/actions/update-markets-data.js`, () => {
	it(`should dispatch an Update Markets Data action`, () => {
		const marketsOutcomesData = {
			someData: 'something',
			moreData: 'even more!'
		};
		const expectedOutput = {
			type: action.UPDATE_MARKETS_DATA,
			...marketsOutcomesData
		};
		assert.deepEqual(action.updateMarketsData(marketsOutcomesData), expectedOutput, `Update Markets Data action misfired.`);
	});

	it(`should dispatch an update market data action`, () => {
		const marketData = {
			marketID: '123',
			outcomeID: 'some outcome',
			details: {
				adetail: 'B: answer'
			}
		};
		const expectedOutput = {
			type: action.UPDATE_MARKET_DATA,
			marketData
		};
		assert.deepEqual(action.updateMarketData(marketData), expectedOutput, `Update Market Data didn't fire correctly`);
	});
});
