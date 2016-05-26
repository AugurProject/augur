import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`Selector shape tests. Selector...`, () => {
if (selectors.update) {
	// update: function
	it(`should contain a update function`, () => {
		let actual = selectors.update;
		if (assert.isDefined(actual, `update isn't defined`)) {
			assert.isFunction(actual, `update isn't a function`);
		}
	});
} else {
	console.log(`
*******************************************************
| - selectors.update isn't defined. skipping test.    |
*******************************************************
`);
}

if (selectors.loginAccount) {
	// loginAccount:
  //  { id: '123',
  //    handle: 'Johnny',
  //    rep:
  //     { value: 0,
  //       formattedValue: 0,
  //       formatted: '-',
  //       rounded: '-',
  //       minimized: '-',
  //       full: '-',
  //       denomination: 'rep' },
  //    ether:
  //     { value: 0,
  //       formattedValue: 0,
  //       formatted: '-',
  //       rounded: '-',
  //       minimized: '-',
  //       full: '-',
  //       denomination: 'eth' },
  //    realEther:
  //     { value: 0,
  //       formattedValue: 0,
  //       formatted: '-',
  //       rounded: '-',
  //       minimized: '-',
  //       full: '-',
  //       denomination: 'eth' } },
	it(`should contain a loginAccount with the expected shape`, () => {
		let actual = selectors.loginAccount;
		// loginAccount overall
		assert.isDefined(actual, `loginAccount isn't defined`);
		assert.isObject(actual, `loginAccount isn't an object`);

		// loginAccount.id
		assert.isDefined(actual.id, `loginAccount.id isn't defined`);
		assert.isString(actual.id, `loginAccount.id isn't a string`);

		// loginAccount.handle
		assert.isDefined(actual.handle, `loginAccount.handle isn't defined`);
		assert.isString(actual.handle, `loginAccount.handle isn't a string`);

		// loginAccount.rep
		assert.isDefined(actual.rep, `loginAccount.rep isn't defined`);
		assert.isObject(actual.rep , `loginAccount.rep isn't an object`);
		assert.isDefined(actual.rep.value, `loginAccount.rep.value isn't defined`);
		assert.isNumber(actual.rep.value, `loginAccount.rep.value isn't a number`);
		assert.isDefined(actual.rep.formattedValue, `loginAccount.rep.formattedValue isn't defined`);
		assert.isNumber(actual.rep.formattedValue, `loginAccount.rep.formattedValue isn't a number`);
		assert.isDefined(actual.rep.formatted, `loginAccount.rep.formatted isn't defined`);
		assert.isString(actual.rep.formatted, `loginAccount.rep.formatted isn't a string`);
		assert.isDefined(actual.rep.rounded, `loginAccount.rep.rounded isn't defined`);
		assert.isString(actual.rep.rounded, `loginAccount.rep.rounded isn't a string`);
		assert.isDefined(actual.rep.minimized, `loginAccount.rep.minimized isn't defined`);
		assert.isString(actual.rep.minimized, `loginAccount.rep.minimized isn't a string`);
		assert.isDefined(actual.rep.full, `loginAccount.rep.full isn't defined`);
		assert.isString(actual.rep.full, `loginAccount.rep.full isn't a string`);
		assert.isDefined(actual.rep.denomination, `loginAccount.rep.denomination isn't defined`);
		assert.isString(actual.rep.denomination, `loginAccount.rep.denomination isn't a string`);
		assert.equal(actual.rep.denomination, 'rep', `loginAccount.rep.denomination isn't 'rep'`);

		// loginAccount.ether
		assert.isDefined(actual.ether, `loginAccount.ether isn't defined`);
		assert.isObject(actual.ether , `loginAccount.ether isn't an object`);
		assert.isDefined(actual.ether.value, `loginAccount.ether.value isn't defined`);
		assert.isNumber(actual.ether.value, `loginAccount.ether.value isn't a number`);
		assert.isDefined(actual.ether.formattedValue, `loginAccount.ether.formattedValue isn't defined`);
		assert.isNumber(actual.ether.formattedValue, `loginAccount.ether.formattedValue isn't a number`);
		assert.isDefined(actual.ether.formatted, `loginAccount.ether.formatted isn't defined`);
		assert.isString(actual.ether.formatted, `loginAccount.ether.formatted isn't a string`);
		assert.isDefined(actual.ether.rounded, `loginAccount.ether.rounded isn't defined`);
		assert.isString(actual.ether.rounded, `loginAccount.ether.rounded isn't a string`);
		assert.isDefined(actual.ether.minimized, `loginAccount.ether.minimized isn't defined`);
		assert.isString(actual.ether.minimized, `loginAccount.ether.minimized isn't a string`);
		assert.isDefined(actual.ether.full, `loginAccount.ether.full isn't defined`);
		assert.isString(actual.ether.full, `loginAccount.ether.full isn't a string`);
		assert.isDefined(actual.ether.denomination, `loginAccount.ether.denomination isn't defined`);
		assert.isString(actual.ether.denomination, `loginAccount.ether.denomination isn't a string`);
		assert.equal(actual.ether.denomination, 'eth', `loginAccount.ether.denomination isn't 'eth'`);

		// loginAccount.realEther
		assert.isDefined(actual.realEther, `loginAccount.realEther isn't defined`);
		assert.isObject(actual.realEther , `loginAccount.realEther isn't an object`);
		assert.isDefined(actual.realEther.value, `loginAccount.realEther.value isn't defined`);
		assert.isNumber(actual.realEther.value, `loginAccount.realEther.value isn't a number`);
		assert.isDefined(actual.realEther.formattedValue, `loginAccount.realEther.formattedValue isn't defined`);
		assert.isNumber(actual.realEther.formattedValue, `loginAccount.realEther.formattedValue isn't a number`);
		assert.isDefined(actual.realEther.formatted, `loginAccount.realEther.formatted isn't defined`);
		assert.isString(actual.realEther.formatted, `loginAccount.realEther.formatted isn't a string`);
		assert.isDefined(actual.realEther.rounded, `loginAccount.realEther.rounded isn't defined`);
		assert.isString(actual.realEther.rounded, `loginAccount.realEther.rounded isn't a string`);
		assert.isDefined(actual.realEther.minimized, `loginAccount.realEther.minimized isn't defined`);
		assert.isString(actual.realEther.minimized, `loginAccount.realEther.minimized isn't a string`);
		assert.isDefined(actual.realEther.full, `loginAccount.realEther.full isn't defined`);
		assert.isString(actual.realEther.full, `loginAccount.realEther.full isn't a string`);
		assert.isDefined(actual.realEther.denomination, `loginAccount.realEther.denomination isn't defined`);
		assert.isString(actual.realEther.denomination, `loginAccount.realEther.denomination isn't a string`);
		assert.equal(actual.realEther.denomination, 'eth', `loginAccount.realEther.denomination isn't 'eth'`);
	});
} else {
	console.log(`
*************************************************************************
selectors.loginAccount isn't defined. Skipping loginAccount test.
*************************************************************************`);
}

if (selectors.markets) {
	// markets: [ {...}, {...} ]
	it(`should contain a markets array`, () => {
		let actual = selectors.markets;

		assert.isDefined(actual, `markets is not defined`);
		assert.isArray(actual, `markets isn't an array`);
	});
} else {
	console.log(`
****************************************************************
| - selectors.markets isn't defined. skipping markets test.    |
****************************************************************
`);
}

if (selectors.markets && selectors.markets[0]) {
	// markets:
  //  [ { id: '0',
  //      type: 'binary',
  //      description: 'Will the dwerps achieve a mwerp by the end of zwerp 1?',
  //      endDate: [Object],
  //      tradingFeePercent: [Object],
  //      volume: [Object],
  //      isOpen: true,
  //      isPendingReport: false,
  //      marketLink: [Object],
  //      tags: [Object],
  //      outcomes: [Object],
  //      reportableOutcomes: [Object],
  //      tradeSummary: [Getter],
  //      priceTimeSeries: [Object],
  //      positionsSummary: [Object],
  //      report: [Object] },
 	// 				...
	// 	]
	it(`should contain a market with the expected shape`, () => {
		let actual = selectors.markets[0];
		// console.log(actual);
		if (assert.isDefined(actual, `markets is empty.`)) {
			assert.isObject(actual, `markets[0] (market) isn't an object`);

			assert.isDefined(actual.id, `market.id isn't defined.`);
			assert.isString(actual.id, `market.id isn't a string`);

			assert.isDefined(actual.type, `market.type isn't defined.`);
			assert.isString(actual.type, `market.type isn't a string`);

			assert.isDefined(actual.description, `market.description isn't defined`);
			assert.isString(actual.description, `market.description isn't a string`);

			assert.isDefined(actual.endDate, `market.endDate isn't defined`);
			assert.isObject(actual.endDate, `market.endDate isn't an object`);

			assert.isDefined(actual.tradingFeePercent, `market.tradingFeePercent isn't defined`);
			assert.isObject(actual.tradingFeePercent, `market.tradingFeePercent isn't an object`);

			assert.isDefined(actual.volume, `market.volume isn't defined`);
			assert.isObject(actual.volume, `market.volume isn't an object`);

			assert.isDefined(actual.isOpen, `market.isOpen isn't defined`);
			assert.isBoolean(actual.isOpen, `market.isOpen isn't a boolean`);

			assert.isDefined(actual.isPendingReport, `market.isPendingReport isn't defined`);
			assert.isBoolean(actual.isPendingReport, `market.isPendingReport isn't a boolean`);

			assert.isDefined(actual.marketLink, `market.marketLink isn't defined`);
			assert.isObject(actual.marketLink, `market.marketLink isn't an object`);

			assert.isDefined(actual.tags, `market.tags isn't defined`);
			assert.isArray(actual.tags, `market.tags isn't an array`);

			assert.isDefined(actual.outcomes, `market.outcomes isn't defined`);
			assert.isArray(actual.outcomes, `market.outcomes isn't an array`);

			assert.isDefined(actual.reportableOutcomes, `market.reportableOutcomes isn't defined`);
			assert.isArray(actual.reportableOutcomes, `market.reportableOutcomes isn't an array`);

			assert.isDefined(actual.tradeSummary, `market.tradeSummary isn't defined`);
			assert.isObject(actual.tradeSummary, `market.tradeSummary isn't a object`);

			assert.isDefined(actual.priceTimeSeries, `market.priceTimeSeries isn't defined`);
			assert.isArray(actual.priceTimeSeries, `market.priceTimeSeries isn't an array`);

			assert.isDefined(actual.positionsSummary, `market.positionsSummary isn't defined`);
			assert.isObject(actual.positionsSummary, `market.positionsSummary isn't an object`);

			assert.isDefined(actual.report, `market.report isn't defined`);
			assert.isObject(actual.report, `market.positionsSummary isn't an object`);
		}
	});
} else {
	console.log(`
************************************************************************
| - selectors.markets[market] isn't defined. skipping market tests.    |
************************************************************************
`);
}

if (selectors.filters) {
	// filters:
	// [ { title: 'Status', options: [Object] },
	// 	{ title: 'Type', options: [Object] },
	// 	{ title: 'Tags', options: [Object] } ],
	it(`should contain a filteres array with the correct shape`, () => {
		let actual = selectors.filters;
		assert.isDefined(actual, `filters isn't defined`);
		assert.isArray(actual, `filters isn't an array`);
		assert.equal(actual.length, 3, `filters array isn't the expected length`);
		assert.isObject(actual[0], `filters[0] isn't an object`);
		assert.isObject(actual[1], `filters[1] isn't an object`);
		assert.isObject(actual[2], `filters[2] isn't an object`);
	});
} else {
	console.log(`
*****************************************************************
| - selectors.filters isn't defined. skipping filters tests.    |
*****************************************************************
`);
}

if (selectors.activePage) {
	// activePage: 'markets',
	it(`should contain a activePage string`, () => {
		let actual = selectors.activePage;
		assert.isDefined(actual, `activePage isn't defined`);
		assert.isString(actual, `activePage isn't a string`);
	});
} else {
	console.log(`
***********************************************************************
| - selectors.activePage isn't defined. skipping activePage tests.    |
***********************************************************************
`);
}

if (selectors.links) {
	// links:
	// { authLink: { href: '', onClick: [Function: onClick] },
	// 	marketsLink: { href: '', onClick: [Function: onClick] },
	// 	positionsLink: { href: '', onClick: [Function: onClick] },
	// 	transactionsLink: { href: '', onClick: [Function: onClick] },
	// 	marketLink: { href: '', onClick: [Function: onClick] },
	// 	previousLink: { href: '', onClick: [Function: onClick] },
	// 	createMarketLink: { href: '', onClick: [Function: onClick] } },
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
*************************************************************
| - selectors.links isn't defined. skipping links tests.    |
*************************************************************
`);
}

if (selectors.keywords) {
	// keywords: { value: '', onChangeKeywords: [Function: onChangeKeywords] },
	it(`should contain a keywords object with the correct shape`, () => {
		let actual = selectors.keywords;
		assert.isDefined(actual, `keywords isn't defined`);
		assert.isObject(actual, `keywords isn't an object`);
		assert.isDefined(actual.value, `keywords.value isn't defined`);
		assert.isString(actual.value, `keywords.value isn't a string`);
		assert.isDefined(actual.onChangeKeywords, `keywords.onChangeKeywords isn't defined`);
		assert.isFunction(actual.onChangeKeywords, `keywords.onChangeKeywords isn't a function`);
	});
} else {
	console.log(`
*******************************************************************
| - selectors.keywords isn't defined. skipping keywords tests.    |
*******************************************************************
`);
}

if (selectors.authForm) {
	// authForm: {},
	it(`should contain a authForm with the expected shape`, () => {
		let actual = selectors.authForm;
		assert.isDefined(actual, `authForm isn't defined`);
		assert.isObject(actual, `authForm isn't an object`);
	});
} else {
	console.log(`
*******************************************************************
| - selectors.authForm isn't defined. skipping authForm tests.    |
*******************************************************************
`);
}

if (selectors.transactions) {
	// transactions: [],
	it(`should contain a transactions with the expected shape`, () => {
		let actual = selectors.transactions;
		assert.isDefined(actual, `transactions isn't defined`);
		assert.isArray(actual, `transactions isn't an array`);
	});
} else {
	console.log(`
***************************************************************************
| - selectors.transactions isn't defined. skipping transactions tests.    |
***************************************************************************
`);
}

if (selectors.transactionsTotals) {
	// transactionsTotals: { title: '0 Transactions' },
	it(`should contain a transactionsTotals object with the expected shape`, () => {
		let actual = selectors.transactionsTotals;
		assert.isDefined(actual, `transactionsTotals isn't defined`);
		assert.isObject(actual, `transactionsTotals isn't an object as expected`);
		assert.isDefined(actual.title, `transactionsTotals.title isn't defined`);
		assert.isString(actual.title, `transactionsTotals.title isn't a string`);
	});
} else {
	console.log(`
****************************************************************
selectors.transactionsTotals isn't defined.
skipping transactionsTotals tests.
****************************************************************
`);
}

if (selectors.isTransactionsWorking !== undefined) {
	// isTransactionsWorking: false,
	it(`should contain a isTransactionsWorking boolean`, () => {
		let actual = selectors.isTransactionsWorking;
		assert.isDefined(actual, `isTransactionsWorking isn't defined`);
		assert.isBoolean(actual, `isTransactionsWorking isn't a boolean`);
	});
} else {
	console.log(`
***********************************************************************
selectors.isTransactionsWorking isn't defined.
skipping isTransactionsWorking tests.
***********************************************************************
`);
}

if (selectors.searchSort) {
	// searchSort:
  //  { selectedSort: { prop: 'creationDate', isDesc: true },
  //    sortOptions: [ [Object], [Object], [Object] ] },
	it(`should contain a searchSort and is the expected shape`, () => {
		let actual = selectors.searchSort;
		assert.isDefined(actual, `searchSort isn't defined`);
		assert.isObject(actual, `searchSort isn't an object`);
	});
} else {
	console.log(`
***********************************************************************
selectors.searchSort isn't defined. skipping searchSort tests.
***********************************************************************
`);
}

if (selectors.marketsHeader) {
	// marketsHeader: {},
	it(`should contain a marketsHeader and is the expected shape`, () => {
		let actual = selectors.marketsHeader;
		assert.isDefined(actual, `marketsHeader isn't defined`);
		assert.isObject(actual, `marketsHeader isn't an object`);
	});
} else {
	console.log(`
***********************************************************************
selectors.marketsHeader isn't defined. skipping marketsHeader tests.
***********************************************************************
`);
}
	// ********** IS THIS REQUIRED OR A LEFTOVER?!? *****************
  // market: {},
	// **************************************************************

if (selectors.marketsTotals) {
  // marketsTotals:
  //  { positionsSummary:
  //     { numPositions: [Object],
  //       totalValue: [Object],
  //       gainPercent: [Object] },
  //    numPendingReports: 19 },
	it(`should contain a marketsTotal and is the expected shape`, () => {
		let actual = selectors.marketsTotals;
		assert.isDefined(actual, `marketsTotals isn't defined`);
		assert.isObject(actual, `marketsTotals isn't an object`);
		assert.isDefined(actual.positionsSummary, `marketsTotals.positionsSummary isn't defined`);
		assert.isObject(actual.positionsSummary, `marketsTotals.positionsSummary isn't an object as expected`);
		assert.isDefined(actual.numPendingReports, `marketsTotals.numPendingReports isn't defined`);
		assert.isNumber(actual.numPendingReports, `marketsTotals.numPendingReports isn't a number as expected.`)
	});
} else {
	console.log(`
***********************************************************************
selectors.marketsTotals isn't defined. skipping marketsTotals tests.
***********************************************************************
`);
}

if (selectors.onChangeSort) {
  // onChangeSort: [Function],
	it(`should contain a onChangeSort function`, () => {
		let actual = selectors.onChangeSort;
		assert.isDefined(actual, `onChangeSort isn't defined`);
		assert.isFunction(actual, `onChangeSort isn't a function`);
	});
} else {
	console.log(`
************************************************************************
| - selectors.onChangeSort isn't defined. skipping onChangeSort tests. |
************************************************************************
`);
}

if (selectors.pagination) {
  // pagination:
  //  { numPerPage: 10,
  //    numPages: 10,
  //    selectedPageNum: 1,
  //    nextPageNum: 2,
  //    startItemNum: 1,
  //    endItemNum: 10,
  //    numUnpaginated: 89,
  //    nextItemNum: 11,
  //    onUpdateSelectedPageNum: [Function: onUpdateSelectedPageNum] },
	it(`should contain a pagination object with the expected shape`, () => {
		let actual = selectors.pagination;
		assert.isDefined(actual, `pagination isn't defined`);
		assert.isObject(actual, `pagination isn't an object`);

		assert.isDefined(actual.numPerPage, `pagination.numPerPage isn't defined`);
		assert.isNumber(actual.numPerPage, `pagination.numPerPage isn't a Number`);

		assert.isDefined(actual.numPages, `pagination.numPages isn't defined`);
		assert.isNumber(actual.numPages, `pagination.numPages isn't a Number`);

		assert.isDefined(actual.selectedPageNum, `pagination.selectedPageNum isn't defined`);
		assert.isNumber(actual.selectedPageNum, `pagination.selectedPageNum isn't a Number`);

		assert.isDefined(actual.nextPageNum, `pagination.nextPageNum isn't defined`);
		assert.isNumber(actual.nextPageNum, `pagination.nextPageNum isn't a Number`);

		assert.isDefined(actual.startItemNum, `pagination.startItemNum isn't defined`);
		assert.isNumber(actual.startItemNum, `pagination.startItemNum isn't a Number`);

		assert.isDefined(actual.endItemNum, `pagination.endItemNum isn't defined`);
		assert.isNumber(actual.endItemNum, `pagination.endItemNum isn't a Number`);

		assert.isDefined(actual.numUnpaginated, `pagination.numUnpaginated isn't defined`);
		assert.isNumber(actual.numUnpaginated, `pagination.numUnpaginated isn't a Number`);

		assert.isDefined(actual.nextItemNum, `pagination.nextItemNum isn't defined`);
		assert.isNumber(actual.nextItemNum, `pagination.nextItemNum isn't a Number`);

		assert.isDefined(actual.onUpdateSelectedPageNum, `pagination.onUpdateSelectedPageNum isn't defined`);
		assert.isFunction(actual.onUpdateSelectedPageNum, `pagination.onUpdateSelectedPageNum isn't a Function`);
	});
} else {
	console.log(`
********************************************************************
| - selectors.pagination isn't defined. skipping pagination tests. |
********************************************************************
`);
}

if (selectors.createMarketForm) {
  // createMarketForm: {}
	it(`should contain a createMarketForm Object`, () => {
		let actual = selectors.createMarketForm;
		assert.isDefined(actual, `createMarketForm isn't defined`);
		assert.isObject(actual, `createMarketForm isn't an object`);
	});
} else {
	console.log(`
**************************************************************
selectors.createMarketForm isn't defined.
skipping createMarketForm tests.
**************************************************************
`);
}
	// console.log(selectors);
});
