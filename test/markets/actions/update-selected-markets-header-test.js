import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from 'modules/markets/actions/update-selected-markets-header';

describe(`modules/markets/actions/update-selected-markets-header.js`, () => {
	it(`should update the selected Market header`, () => {
		const selectedMarketsHeader = 'myMarketHeader';
		const expectedOutput = {
			type: action.UPDATED_SELECTED_MARKETS_HEADER,
			selectedMarketsHeader
		};
		assert.deepEqual(action.updateSelectedMarketsHeader(selectedMarketsHeader), expectedOutput, `update Selected Markets Header didn't return the correct action object`);
	});
});
