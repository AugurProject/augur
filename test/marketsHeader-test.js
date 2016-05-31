import selectors from '../src/selectors';
import marketsHeaderAssertion from './assertions/marketsHeader';

describe(`selectors.marketsHeader tests:`, () => {
	// marketsHeader: {},
	it(`should contain a marketsHeader and is the expected shape`, () => {
		let actual = selectors.marketsHeader;
		marketsHeaderAssertion(actual);
	});
});
