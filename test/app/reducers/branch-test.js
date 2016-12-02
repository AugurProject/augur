import { describe, it } from 'mocha';
import { assert } from 'chai';
import testState from '../../testState';
import {
	UPDATE_BRANCH
} from '../../../src/modules/app/actions/update-branch';
import reducer from '../../../src/modules/app/reducers/branch';

describe(`modules/app/reducers/branch.js`, () => {
	const thisTestState = Object.assign({}, testState);

	it(`should update the branch object in state`, () => {
		const action = {
			type: UPDATE_BRANCH,
			branch: {
				description: 'testing!',
				periodLength: '12345'
			}
		};
		const expectedOutput = Object.assign({}, thisTestState.branch, action.branch);
		assert.deepEqual(reducer(thisTestState.branch, action), expectedOutput, `Didn't update the branch object correctly`);
	});

});
