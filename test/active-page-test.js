import activePageAssertion from './assertions/activePage';
import selectors from '../src/selectors';

describe(`selector.activePage tests:`, () => {
	// activePage: String,
	it(`should contain a activePage string`, () => {
		let actual = selectors.activePage;
		activePageAssertion(actual);
	});
});
