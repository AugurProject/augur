import selectors from '../src/selectors';
import assertion from './assertions/positions-markets';

describe(`selectors.positionsMarkets tests:`, () => {
	it(`should contain a positionsMarkets and is the expected shape`, () => {
		let actual = selectors.positionsMarkets;
		assertion(actual);
	});
});
