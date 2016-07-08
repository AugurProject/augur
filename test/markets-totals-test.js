import selectors from '../src/selectors';
import assertMarketsTotals from './assertions/markets-totals';

describe(`selectors.marketsTotals tests:`, () => {
	it(`should contain a marketsTotal and is the expected shape`, () => {
		let actual = selectors.marketsTotals;
		assertMarketsTotals(actual);
	});
});
