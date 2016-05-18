import {
	assert
} from 'chai';
import selector from '../../../src/modules/app/selectors/active-page';

describe(`modules/app/selectors/active-page.js`, () => {
	let out = 'markets';

	it(`should get activepage from store`, () => {
		assert.equal(selector(), out, `Didn't get the active page or wasn't defaulted to 'markets'`);
	});

});
