import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.links tests:`, () => {
	if (selectors.links) {
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
			assert.isDefined(actual, `links isn't defined`);
			assert.isObject(actual, `links isn't an object`);

			actual = selectors.links.authLink;
			assert.isDefined(actual, `links.authLink isn't defined`);
			assert.isObject(actual, `links.authLink isn't an object`);
			assert.isDefined(actual.href, `links.authLink.href isn't defined`);
			assert.isString(actual.href, `links.authLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.authLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.authLink.onClick isn't a function`);

			actual = selectors.links.marketsLink;
			assert.isDefined(actual, `links.marketsLink isn't defined`);
			assert.isObject(actual, `links.marketsLink isn't an object`);
			assert.isDefined(actual.href, `links.marketsLink.href isn't defined`);
			assert.isString(actual.href, `links.marketsLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.marketsLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.marketsLink.onClick isn't a function`);

			actual = selectors.links.positionsLink;
			assert.isDefined(actual, `links.positionsLink isn't defined`);
			assert.isObject(actual, `links.positionsLink isn't an object`);
			assert.isDefined(actual.href, `links.positionsLink.href isn't defined`);
			assert.isString(actual.href, `links.positionsLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.positionsLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.positionsLink.onClick isn't a function`);

			actual = selectors.links.transactionsLink;
			assert.isDefined(actual, `links.transactionsLink isn't defined`);
			assert.isObject(actual, `links.transactionsLink isn't an object`);
			assert.isDefined(actual.href, `links.transactionsLink.href isn't defined`);
			assert.isString(actual.href, `links.transactionsLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.transactionsLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.transactionsLink.onClick isn't a function`);

			actual = selectors.links.marketLink;
			assert.isDefined(actual, `links.marketLink isn't defined`);
			assert.isObject(actual, `links.marketLink isn't an object`);
			assert.isDefined(actual.href, `links.marketLink.href isn't defined`);
			assert.isString(actual.href, `links.marketLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.marketLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.marketLink.onClick isn't a function`);

			actual = selectors.links.previousLink;
			assert.isDefined(actual, `links.previousLink isn't defined`);
			assert.isObject(actual, `links.previousLink isn't an object`);
			assert.isDefined(actual.href, `links.previousLink.href isn't defined`);
			assert.isString(actual.href, `links.previousLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.previousLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.previousLink.onClick isn't a function`);

			actual = selectors.links.createMarketLink;
			assert.isDefined(actual, `links.createMarketLink isn't defined`);
			assert.isObject(actual, `links.createMarketLink isn't an object`);
			assert.isDefined(actual.href, `links.createMarketLink.href isn't defined`);
			assert.isString(actual.href, `links.createMarketLink.href isn't a string`);
			assert.isDefined(actual.onClick, `links.createMarketLink.onClick isn't defined`);
			assert.isFunction(actual.onClick, `links.createMarketLink.onClick isn't a function`);
		});
	} else {
		console.log(`
- selectors.links isn't defined.
	- skipping links tests.`);
	}
});
