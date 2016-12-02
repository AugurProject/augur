import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from '../../../src/modules/markets/actions/update-outcome-price';

describe(`modules/markets/actions/update-outcome-price.js`, () => {
	it(`should return an update outcome price action`, () => {
		const marketID = '123';
		const outcomeID = '456';
		const price = 6.44;
		const expectedOutput = {
			type: action.UPDATE_OUTCOME_PRICE,
			marketID,
			outcomeID,
			price
		};
		assert.deepEqual(action.updateOutcomePrice(marketID, outcomeID, price), expectedOutput, `action didn't return the correct object`);
	});
});
