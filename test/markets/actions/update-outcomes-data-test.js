import {
	assert
} from 'chai';
import * as action from '../../../src/modules/markets/actions/update-outcomes-data';

describe(`modules/markets/actions/update-outcomes-data.js`, () => {
	it(`should dispatch an Update Markets Data action`, () => {
		const marketsOutcomesData = {
			someData: 'something',
			moreData: 'even more!'
		};
		const expectedOutput = {
			type: action.UPDATE_OUTCOMES_DATA,
			outcomesData: { ...marketsOutcomesData }
		};
		assert.deepEqual(action.updateOutcomesData(marketsOutcomesData), expectedOutput, `Update Markets Data action misfired.`);
	});
});
