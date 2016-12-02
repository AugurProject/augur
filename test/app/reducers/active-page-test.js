import { describe, it } from 'mocha';
import { assert } from 'chai';
import { UPDATE_URL } from '../../../src/modules/link/actions/update-url';
import reducer from '../../../src/modules/app/reducers/active-view';
import testState from '../../testState';

describe(`modules/app/reducers/active-page.js`, () => {
	const thisTestState = Object.assign({}, testState);

	it(`should update activepage`, () => {
		const action = {
			type: UPDATE_URL,
			parsedURL: {
				searchParams: { page: 'login' }
			}
		};
		const expectedOutput = 'login';
		assert.equal(reducer(thisTestState.activePage, action), expectedOutput, `didn't switch to login from default page of 'markets'`);
	});
});
