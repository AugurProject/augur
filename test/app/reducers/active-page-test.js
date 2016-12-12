import { describe, it } from 'mocha';
import { assert } from 'chai';
import { UPDATE_URL } from 'modules/link/actions/update-url';
import reducer from 'modules/app/reducers/active-view';
import testState from 'test/testState';

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
