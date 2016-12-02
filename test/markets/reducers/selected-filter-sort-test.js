import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	UPDATE_SELECTED_FILTER_SORT
} from '../../../src/modules/markets/actions/update-selected-filter-sort';
import reducer from '../../../src/modules/markets/reducers/selected-filter-sort';

describe(`modules/markets/reducers/selected-sort.js`, () => {
	it(`should update the selected filter + sort correctly`, () => {
		const action = {
			type: UPDATE_SELECTED_FILTER_SORT,
			selectedFilterSort: {
				type: 'closed',
				isDesc: false
			}
		};
		let expectedOutput = {
			type: 'open',
			sort: 'volume',
			isDesc: true
		};

		assert.deepEqual(reducer(undefined, { type: 'test-init-state' }), expectedOutput, `didn't return the initial state`);

		expectedOutput = {
			...expectedOutput,
			type: 'closed',
			isDesc: false
		};

		assert.deepEqual(reducer({
			type: 'open',
			sort: 'volume',
			isDesc: true
		}, action), expectedOutput, `Didn't return a correctly updated state`);
	});
});
