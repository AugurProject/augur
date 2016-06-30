var activePage = require('./activePage');
var authForm = require('./authForm');
var createMarketForm = require('./createMarketForm');
var filters = require('./filters');
var isTransactionsWorking = require('./isTransactionsWorking');
var keywords = require('./keywords');
var links = require('./links');
var loginAccount = require('./loginAccount');
var market = require('./market');
var markets = require('./markets');
var marketsHeader = require('./marketsHeader');
var marketsTotals = require('./marketsTotals');
var onChangeSort = require('./onChangeSort');
var pagination = require('./pagination');
var searchSort = require('./searchSort');
var siteHeader = require('./siteHeader');
var transactions = require('./transactions');
var transactionsTotals = require('./transactionsTotals');
var update = require('./update');
var trade = require('./trade');

module.exports = {
	activePage: activePage,
	authForm: authForm,
	createMarketForm: createMarketForm,
	filters: filters,
	isTransactionsWorking: isTransactionsWorking,
	keywords: keywords,
	links: links,
	loginAccount: loginAccount,
	market: market,
	markets: markets,
	marketsHeader: marketsHeader,
	marketsTotals: marketsTotals,
	onChangeSort: onChangeSort,
	pagination: pagination,
	searchSort: searchSort,
	siteHeader: siteHeader,
	transactions: transactions,
	transactionsTotals: transactionsTotals,
	update: update,
	trade: trade
};
