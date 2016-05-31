import selectors from '../src/selectors';
import marketsAssertion from './assertions/markets';

describe(`selectors.markets tests:`, () => {
	// markets: [ Object, Object, ... ]
	it(`should contain a markets array`, () => {
		let actual = selectors.markets;
		marketsAssertion(actual);
	});
});
