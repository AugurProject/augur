var assert = require('chai').assert;
var loginAccount = require('./loginAccount');
var activePage = require('./activePage');
var positionsSummary = require('./marketsTotals').positionsSummaryAssertion;
var transactionsTotals = require('./transactionsTotals');
var isTransactionsWorking = require('./isTransactionsWorking');
// p.siteHeader = {
// 	activePage: p.activePage,
// 	loginAccount: p.loginAccount,
// 	positionsSummary: p.marketsTotals.positionsSummary,
// 	transactionsTotals: p.transactionsTotals,
// 	isTransactionsWorking: p.isTransactionsWorking,
//
// 	marketsLink: p.links && p.links.marketsLink || undefined,
// 	positionsLink: p.links && p.links.positionsLink || undefined,
// 	transactionsLink: p.links && p.links.transactionsLink || undefined,
// 	authLink: p.links && p.links.authLink || undefined
// };
function siteHeaderAssertion(actual) {
	assert.isDefined(actual, `siteHeader isn't defined`);
	assert.isObject(actual, `siteHeader isn't a object`);
	activePage(actual.activePage);
	loginAccount(actual.loginAccount);
	positionsSummary(actual.positionsSummary);
	transactionsTotals(actual.transactionsTotals);
	isTransactionsWorking(actual.isTransactionsWorking);
}
module.exports = siteHeaderAssertion;
