import selectors from '../src/selectors';
import updateAssertion from './assertions/update';

describe(`selectors.update tests:`, () => {
	// update: function
	it(`should contain a update function`, () => {
		let actual = selectors.update;
		updateAssertion(actual);
	});
});
