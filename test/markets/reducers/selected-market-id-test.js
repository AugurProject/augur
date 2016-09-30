import {
	assert
} from 'chai';
import {
	UPDATE_URL
} from '../../../src/modules/link/actions/update-url';
import reducer from '../../../src/modules/markets/reducers/selected-market-id';
import testState from '../../testState';

describe(`modules/markets/reducers/selected-market-id.js`, () => {
	let action, out, test;
	let state = Object.assign({}, testState);

	it(`should change the selected market id`, () => {
		action = {
			type: UPDATE_URL,
			parsedURL: {
				searchParams: { page: 'm', m: '_test' }
			}
		};
		test = reducer(state.selectedMarketID, action);
		out = '0x000000000000000000000000000000000000000000000000000000000000test';
		assert.equal(test, out, `Didn't get the markt id`);
	});
});
