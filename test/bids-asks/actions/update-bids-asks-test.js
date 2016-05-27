import {
	assert
} from 'chai';
import * as action from '../../../src/modules/bids-asks/actions/update-order';

describe(`modules/bids-asks/actions/update-bids-asks.js`, () => {
	it(`should fire the UPDATE_BIDSASKS_DATA action with data`, () => {
		const bidsAsksData = {
			hello: 'world! [test data]'
		};
		const expectedOutput = {
			type: action.UPDATE_ORDER,
			bidsAsksData
		};
		assert.deepEqual(action.updateBidsAsks(bidsAsksData), expectedOutput, `Updating the Bids-Asks didn't return the correct action!`);
	});
});
