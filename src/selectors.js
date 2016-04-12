import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/app/constants/pages';

var selectors = {
	activePage: MARKETS,
	loginAccount: {},
	siteHeader: {
		loginAccount: {}
	},
	links: {},

	authForm: {},

	markets: [],
	allMarkets: [],
	filteredMarkets: [],
	favoriteMarkets: [],
	reportMarkets: [],

	market: {},
	outcomes: [],

	marketsHeader: {},
	filtersProps: {},
	keywordsChangeHandler: () => {},

	tradeInProgress: {},
	tradeMarket: {},
	tradeOrders: [],
	tradeOrdersTotals: {},
	placeTradeHandler: () => {},

	positions: [],
	positionsSummary: {},

	transactions: [],
	transactionsTotals: {},
	nextTransaction: {},
	isTransactionsWorking: false,

	createMarketForm: {},
	createMarketForm2: {},
	createMarketForm3: {},
	createMarketForm4: {},
	createMarketForm5: {},

	report: {},
	submitReportHandler: () => {}
};

module.exports = {};

Object.keys(selectors).forEach(selectorKey => Object.defineProperty(module.exports, selectorKey, { get: () => selectors[selectorKey], enumerable: true }));




