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

selectors.positions =  [{
	rowspan: 1,
	description: 'Market description #1',
	outcomeName: '',
	qtyShares: makeNumber(16898, 'Shares'),
	totalValue: makeNumber(14877, 'eth'),
	gainPercent: makeNumber(14, '%'),
	lastPrice: makeNumber(0.877, 'eth'),
	purchasePrice: makeNumber(0.77, 'eth'),
	shareChange: makeNumber(0.107, 'eth'),
	totalCost: makeNumber(12555, 'eth'),
	netChange: makeNumber(3344, 'eth'),
	marketLink: {
		text: 'Trade',
		classNamme: 'trade',
		onClick: () => module.exports.update({ activePage: M, market: { id: 1, description: '#1desc' } })
	}
}];

selectors.positionsSummary =  {
	numPositions: makeNumber(3, 'Positions', true),
	totalValue: makeNumber(985, 'eth'),
	gainPercent: makeNumber(15, '%')
};

selectors.transactions =  [];
selectors.transactionsTotals =  {
	title: '0 Transactions'
};
selectors.nextTransaction =  {};
selectors.isTransactionsWorking =  false;


selectors.selectedSort = { prop: 'creationDate', isDesc: true };
selectors.sortOptions = [{ label: 'Creation Date', value: 'creationDate' }, { label: 'End Date', value: 'endDate' }, { label: 'Description', value: 'description' }];

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
selectors.onChangeSort = (prop, isDesc) => {
	if (isDesc !== false && isDesc !== true) {
		isDesc = selectors.selectedSort.isDesc;
	}
	module.exports.update({ selectedSort: { prop: prop || selectors.selectedSort.prop, isDesc }});
};

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

function makeNumber(num, denomination, omitSign) {
	var o = {
		value: num,

		formattedValue: num,
		formatted: num.toString(),

		roundedValue: num,
		rounded: num.toString(),

		minimized: num.toString(),
		denomination: denomination || ''
	};

	if (!omitSign) {
        if (o.value > 0) {
            o.formatted = '+' + o.formatted;
            o.rounded = '+' + o.rounded;
            o.minimized = '+' + o.minimized;
        }
        else if (o.formattedValue < 0) {
            o.formatted = '-' + o.formatted;
            o.rounded = '-' + o.rounded;
            o.minimized = '-' + o.minimized;
        }
	}

	o.full = o.formatted + o.denomination;

	return o;
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