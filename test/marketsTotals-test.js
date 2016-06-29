import selectors from '../src/selectors';
import marketsTotalAssertion from './assertions/marketsTotals';

describe(`selectors.marketsTotals tests:`, () => {
	it(`should contain a marketsTotal and is the expected shape`, () => {
		let actual = selectors.marketsTotals;
		marketsTotalAssertion(actual);
	});
});
