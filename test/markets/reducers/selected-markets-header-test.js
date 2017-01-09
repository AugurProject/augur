import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	UPDATED_SELECTED_MARKETS_HEADER
} from 'modules/markets/actions/update-selected-markets-header';
import reducer from 'modules/markets/reducers/selected-markets-header';

describe(`modules/markets/reducers/selected-markets-header.js`, () => {
	it(`should update the selected header`, () => {
		const selectedMarketsHeader = 'testmarket';
		const action = {
			type: UPDATED_SELECTED_MARKETS_HEADER,
			selectedMarketsHeader
		};
		assert.equal(reducer(undefined, action), selectedMarketsHeader, `it didn't properly return the new Selected Market Header`);
		assert.equal(reducer(undefined, {
			type: 'test'
		}), null, `it didn't default to null if no state is passed and we use an action it doesn't recognize`);
	});
});
