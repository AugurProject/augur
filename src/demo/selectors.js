import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from '../modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from '../modules/auth/constants/auth-types';

var selectors = {};

selectors.activePage = MARKETS;

selectors.loginAccount = {
	id: '123',
	handle: 'Johnny',
	rep: emptyNumber('rep'),
	ether: emptyNumber('eth'),
	realEther: emptyNumber('eth')
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

selectors.positions =  [];
selectors.positionsSummary =  {
	title: '0 Positions',
	numPositions: null,
	totalValue: null,
	gainPercent: null
};

selectors.transactions =  [];
selectors.transactionsTotals =  {
	title: '0 Transactions'
};
selectors.nextTransaction =  {};
selectors.isTransactionsWorking =  false;

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

function zeroNumber(denomination) {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '0',
		rounded: '0',
		minimized: '0',
		full: '0',
		denomination: denomination || ''
	};
}

function emptyNumber(denomination) {
	return {
		value: 0,
		formattedValue: 0,
		formatted: '-',
		rounded: '-',
		minimized: '-',
		full: '-',
		denomination: denomination || ''
	};
}