import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from 'modules/markets/actions/update-markets-data';

describe(`modules/markets/actions/update-markets-data.js`, () => {
	it(`should dispatch an Update Markets Data action`, () => {
		const marketsOutcomesData = {
			someData: 'something',
			moreData: 'even more!'
		};
		const expectedOutput = {
			type: action.UPDATE_MARKETS_DATA,
			marketsData: { ...marketsOutcomesData }
		};
		assert.deepEqual(action.updateMarketsData(marketsOutcomesData), expectedOutput, `Update Markets Data action misfired.`);
	});
});
