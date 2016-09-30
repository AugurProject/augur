import { assert } from 'chai';
import { UPDATE_URL } from '../../../src/modules/link/actions/update-url';
import reducer from '../../../src/modules/app/reducers/active-page';
import testState from '../../testState';

describe(`modules/app/reducers/active-page.js`, () => {
	let action;
	let thisTestState = Object.assign({}, testState);

	it(`should update activepage`, () => {
		action = {
			type: UPDATE_URL,
			parsedURL: {
				searchParams: { page: 'login' }
			}
		};
		const expectedOutput = 'login';
		assert.equal(reducer(thisTestState.activePage, action), expectedOutput, `didn't switch to login from default page of 'markets'`);
	});
});
