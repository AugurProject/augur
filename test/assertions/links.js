import { assert } from 'chai';

export default function(links) {
	assert.isDefined(links, `links isn't defined`);
	assert.isObject(links, `links isn't an object`);

	var authLink = links.authLink;
	assert.isDefined(authLink, `links.authLink isn't defined`);
	assert.isObject(authLink, `links.authLink isn't an object`);
	assert.isDefined(authLink.href, `links.authLink.href isn't defined`);
	assert.isString(authLink.href, `links.authLink.href isn't a string`);
	assert.isDefined(authLink.onClick, `links.authLink.onClick isn't defined`);
	assert.isFunction(authLink.onClick, `links.authLink.onClick isn't a function`);

	var marketsLink = links.marketsLink;
	assert.isDefined(marketsLink, `links.marketsLink isn't defined`);
	assert.isObject(marketsLink, `links.marketsLink isn't an object`);
	assert.isDefined(marketsLink.href, `links.marketsLink.href isn't defined`);
	assert.isString(marketsLink.href, `links.marketsLink.href isn't a string`);
	assert.isDefined(marketsLink.onClick, `links.marketsLink.onClick isn't defined`);
	assert.isFunction(marketsLink.onClick, `links.marketsLink.onClick isn't a function`);

	var positionsLink = links.positionsLink;
	assert.isDefined(positionsLink, `links.positionsLink isn't defined`);
	assert.isObject(positionsLink, `links.positionsLink isn't an object`);
	assert.isDefined(positionsLink.href, `links.positionsLink.href isn't defined`);
	assert.isString(positionsLink.href, `links.positionsLink.href isn't a string`);
	assert.isDefined(positionsLink.onClick, `links.positionsLink.onClick isn't defined`);
	assert.isFunction(positionsLink.onClick, `links.positionsLink.onClick isn't a function`);

	var transactionsLink = links.transactionsLink;
	assert.isDefined(transactionsLink, `links.transactionsLink isn't defined`);
	assert.isObject(transactionsLink, `links.transactionsLink isn't an object`);
	assert.isDefined(transactionsLink.href, `links.transactionsLink.href isn't defined`);
	assert.isString(transactionsLink.href, `links.transactionsLink.href isn't a string`);
	assert.isDefined(transactionsLink.onClick, `links.transactionsLink.onClick isn't defined`);
	assert.isFunction(transactionsLink.onClick, `links.transactionsLink.onClick isn't a function`);

	var marketLink = links.marketLink;
	assert.isDefined(marketLink, `links.marketLink isn't defined`);
	assert.isObject(marketLink, `links.marketLink isn't an object`);
	assert.isDefined(marketLink.href, `links.marketLink.href isn't defined`);
	assert.isString(marketLink.href, `links.marketLink.href isn't a string`);
	assert.isDefined(marketLink.onClick, `links.marketLink.onClick isn't defined`);
	assert.isFunction(marketLink.onClick, `links.marketLink.onClick isn't a function`);

	var previousLink = links.previousLink;
	assert.isDefined(previousLink, `links.previousLink isn't defined`);
	assert.isObject(previousLink, `links.previousLink isn't an object`);
	assert.isDefined(previousLink.href, `links.previousLink.href isn't defined`);
	assert.isString(previousLink.href, `links.previousLink.href isn't a string`);
	assert.isDefined(previousLink.onClick, `links.previousLink.onClick isn't defined`);
	assert.isFunction(previousLink.onClick, `links.previousLink.onClick isn't a function`);

	var createMarketLink = links.createMarketLink;
	assert.isDefined(createMarketLink, `links.createMarketLink isn't defined`);
	assert.isObject(createMarketLink, `links.createMarketLink isn't an object`);
	assert.isDefined(createMarketLink.href, `links.createMarketLink.href isn't defined`);
	assert.isString(createMarketLink.href, `links.createMarketLink.href isn't a string`);
	assert.isDefined(createMarketLink.onClick, `links.createMarketLink.onClick isn't defined`);
	assert.isFunction(createMarketLink.onClick, `links.createMarketLink.onClick isn't a function`);
};
