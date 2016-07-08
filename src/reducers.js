import env from './modules/app/reducers/env';
import blockchain from './modules/app/reducers/blockchain';
import branch from './modules/app/reducers/branch';
import connection from './modules/app/reducers/connection';

import auth from './modules/auth/reducers/auth';
import loginAccount from './modules/auth/reducers/login-account';
import activePage from './modules/app/reducers/active-page';

import marketsData from './modules/markets/reducers/markets-data';
import favorites from './modules/markets/reducers/favorites';
import pagination from './modules/markets/reducers/pagination';

import reports from './modules/reports/reducers/reports';

import outcomes from './modules/markets/reducers/outcomes';
import marketOrderBooks from './modules/bids-asks/reducers/market-order-books';
import accountTrades from './modules/positions/reducers/account-trades';
import transactionsData from './modules/transactions/reducers/transactions-data';

import selectedMarketsHeader from './modules/markets/reducers/selected-markets-header';
import selectedMarketID from './modules/markets/reducers/selected-market-id';
import tradesInProgress from './modules/trade/reducers/trades-in-progress';
import createMarketInProgress from './modules/create-market/reducers/create-market-in-progress';
import keywords from './modules/markets/reducers/keywords';
import selectedFilters from './modules/markets/reducers/selected-filters';
import selectedTags from './modules/markets/reducers/selected-tags';
import selectedSort from './modules/markets/reducers/selected-sort';
import priceHistory from './modules/markets/reducers/price-history';

import selectedOutcomeID from './modules/outcome/reducers/selected-outcome-id';

module.exports = {
	env,
	blockchain,
	branch,
	connection,

	auth,
	loginAccount,
	activePage,

	marketsData,
	favorites,
	pagination,

	reports,

	selectedMarketID,
	selectedMarketsHeader,
	keywords,
	selectedFilters,
	selectedTags,
	selectedSort,
	priceHistory,
	selectedOutcomeID,

	tradesInProgress,
	createMarketInProgress,

	outcomes,
	marketOrderBooks,
	accountTrades,
	transactionsData
};
