import {
	assert
} from 'chai';
import {
	SHOW_LINK
} from '../../../src/modules/link/actions/show-link';
import reducer from '../../../src/modules/app/reducers/active-page';
import testState from '../../testState';

describe(`modules/app/reducers/active-page.js`, () => {
	let action;
	let thisTestState = Object.assign({}, testState);

	it(`should update activepage`, () => {
		action = {
			type: SHOW_LINK,
			parsedURL: {
				pathArray: ['/login']
			}
		};
		const expectedOutput = 'login';
		assert.equal(reducer(thisTestState.activePage, action), expectedOutput, `didn't switch to login from default page of 'markets'`);
	});
});
