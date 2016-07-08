var assert = require('chai').assert;
var loginAccount = require('./loginAccount');
var activePage = require('./active-page');
var positionsSummary = require('./markets-totals').positionsSummaryAssertion;
var transactionsTotals = require('./transactionsTotals');
var isTransactionsWorking = require('./isTransactionsWorking');

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
