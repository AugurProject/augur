import selectors from '../src/selectors';
import activePageAssertion from './assertions/active-page';

describe(`selector.activePage tests:`, () => {
	// activePage: String,
	it(`should contain a activePage string`, () => {
		let actual = selectors.activePage;
		activePageAssertion(actual);
	});
});
