import activeView from 'selectors/active-view';
import authForm from 'selectors/auth-form';
import orderCancellation from 'selectors/order-cancellation';
import createMarketForm from 'selectors/create-market-form';
import tags from 'selectors/tags';
import keywords from 'selectors/keywords';
import links from 'selectors/links';
import loginAccount from 'selectors/login-account';
import market from 'selectors/market';
import markets from 'selectors/markets';
import marketsTotals from 'selectors/markets-totals';
import marketDataUpdater from 'selectors/market-data-updater';
import marketDataAge from 'selectors/market-data-age';
import isTransactionsWorking from 'selectors/is-transactions-working';
import transactions from 'selectors/transactions';
import transactionsTotals from 'selectors/transactions-totals';
import url from 'selectors/url';
import portfolio from 'selectors/portfolio';
import portfolioNavItems from 'selectors/portfolio-nav-items';
import portfolioTotals from 'selectors/portfolio-totals';
import loginAccountPositions from 'selectors/login-account-positions';
import loginAccountMarkets from 'selectors/login-account-markets';
import loginAccountReports from 'selectors/login-account-reports';
import myReports from 'selectors/my-reports';
import tradeCommitLock from 'selectors/trade-commit-lock';
import positionsMarkets from 'selectors/positions-markets';
import myMarkets from 'selectors/my-markets';
import filterSort from 'selectors/filter-sort';
import pagination from 'selectors/pagination';
import selectedOutcome from 'selectors/selected-outcome';
import marketsHeader from 'selectors/markets-header';
import coreStats from 'selectors/core-stats';
import marketDataNavItems from 'selectors/market-data-nav-items';
import settings from 'selectors/settings';
import chat from 'selectors/chat';
import marketUserDataNavItems from 'selectors/market-user-data-nav-items';
import scalarShareDenomination from 'selectors/scalar-share-denomination';
import marketReportingNavItems from 'selectors/market-reporting-nav-items';

// all selectors should go here
const selectors = {
	activeView,
	authForm,
	orderCancellation,
	createMarketForm,
	tags,
	keywords,
	links,
	loginAccount,
	market,
	markets,
	marketsTotals,
	isTransactionsWorking,
	transactions,
	transactionsTotals,
	url,
	portfolio,
	portfolioNavItems,
	portfolioTotals,
	marketDataUpdater,
	marketDataAge,
	loginAccountPositions,
	loginAccountMarkets,
	loginAccountReports,
	tradeCommitLock,
	// For inclusion in AURC solo testing (former may accumulate from below)
	// TODO -- may be an improvement available for how the tests run such that this wouldn't be necessary
	myReports,
	myMarkets,
	positionsMarkets,
	filterSort,
	pagination,
	selectedOutcome,
	marketsHeader,
	coreStats,
	marketDataNavItems,
	settings,
	chat,
	marketUserDataNavItems,
	scalarShareDenomination,
	marketReportingNavItems
};

// add update helper fn to selectors object
Object.defineProperty(selectors, 'update', {
	value: (newState = {}, options = {}) => {
		if (process.env.NODE_ENV !== 'test' && !options.ignore) {
			console.log('*** update', newState);
		}

		Object.keys(newState).forEach((key) => {
			selectors[key] = newState[key];
		});
		selectors.render();
	},
	enumerable: false
});

module.exports = selectors;
