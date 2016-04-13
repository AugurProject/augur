import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from '../modules/auth/constants/auth-types';

var selectors = {};

selectors.activePage = MARKETS;

selectors.loginAccount = {
	id: '123',
	handle: 'Johnny'
};

selectors.links = {
	authLink: { href: '', onClick: () => module.exports.update({ activePage: LOGIN }) },
	marketsLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	positionsLink: { href: '', onClick: () => module.exports.update({ activePage: POSITIONS }) },
	transactionsLink: { href: '', onClick: () => module.exports.update({ activePage: TRANSACTIONS }) },
	marketLink: { href: '', onClick: () => module.exports.update({ activePage: M }) },
	previousLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	createMarketLink: { href: '', onClick: () => module.exports.update({ activePage: MAKE }) }
};

selectors.authForm = {};

selectors.markets = [];
selectors.allMarkets =  [];
selectors.filteredMarkets =  [];
selectors.favoriteMarkets =  [];
selectors.reportMarkets =  [];

selectors.market =  {};
selectors.outcomes =  [];

selectors.marketsHeader =  {};
selectors.filtersProps =  {};
selectors.keywordsChangeHandler =  () => {};

selectors.tradeInProgress =  {};
selectors.tradeMarket =  {};
selectors.tradeOrders =  [];
selectors.tradeOrdersTotals =  {};
selectors.placeTradeHandler =  () => {};

selectors.positions =  [];
selectors.positionsSummary =  {};

selectors.transactions =  [];
selectors.transactionsTotals =  {};
selectors.nextTransaction =  {};
selectors.isTransactionsWorking =  false;

selectors.createMarketForm =  {};
selectors.createMarketForm2 =  {};
selectors.createMarketForm3 =  {};
selectors.createMarketForm4 =  {};
selectors.createMarketForm5 =  {};

selectors.report =  {};
selectors.submitReportHandler = () => {};

selectors.update = function(newState) {
	Object.keys(newState).forEach(key => selectors[key] = newState[key]);
	selectors.render();
};

module.exports = selectors;

