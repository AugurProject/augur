import linksAssertion from './assertions/links';
import selectors from '../src/selectors';

describe(`selectors.links tests:`, () => {
	// links:
	// { authLink: { href: String, onClick: [Function: onClick] },
	// 	marketsLink: { href: String, onClick: [Function: onClick] },
	// 	positionsLink: { href: String, onClick: [Function: onClick] },
	// 	transactionsLink: { href: String, onClick: [Function: onClick] },
	// 	marketLink: { href: String, onClick: [Function: onClick] },
	// 	previousLink: { href: String, onClick: [Function: onClick] },
	// 	createMarketLink: { href: String, onClick: [Function: onClick] } },
	it(`should contain a links object with the correct shape`, () => {
		let actual = selectors.links;
		linksAssertion(actual);
	});
});
