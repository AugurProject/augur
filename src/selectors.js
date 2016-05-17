import loginAccount from './selectors/login-account';
import markets from './selectors/markets';
import filters from './selectors/filters';

import { makeNumber } from './utils/make-number';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { REGISTER, LOGIN, LOGOUT } from './modules/auth/constants/auth-types';

var selectors = {
	update: (newState = {}) => {
		console.log('*** update', newState);
		Object.keys(newState).forEach(key => selectors[key] = newState[key]);
		selectors.render();
	},
	loginAccount,
	markets,
	filters
};

selectors.activePage = MARKETS;

selectors.links = {
	authLink: { href: '', onClick: () => module.exports.update({ activePage: LOGIN }) },
	marketsLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	positionsLink: { href: '', onClick: () => module.exports.update({ activePage: POSITIONS }) },
	transactionsLink: { href: '', onClick: () => module.exports.update({ activePage: TRANSACTIONS }) },
	marketLink: { href: '', onClick: () => module.exports.update({ activePage: M }) },
	previousLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	createMarketLink: { href: '', onClick: () => module.exports.update({ activePage: MAKE }) }
};

selectors.keywords = {
	value: '',
	onChangeKeywords: () => {}
};

selectors.authForm = {};

selectors.transactions =  [];
selectors.transactionsTotals =  {
	title: '0 Transactions'
};
selectors.isTransactionsWorking =  false;


selectors.searchSort = {
	selectedSort: { prop: 'creationDate', isDesc: true },
	sortOptions: [{ label: 'Creation Date', value: 'creationDate' }, { label: 'End Date', value: 'endDate' }, { label: 'Description', value: 'description' }]
};

selectors.marketsHeader =  {};

selectors.market =  {}; // selected market
selectors.marketsTotals = {
	positionsSummary: {
		numPositions: makeNumber(3, 'Positions', true),
		totalValue: makeNumber(985, 'eth'),
		gainPercent: makeNumber(15, '%')
	},
	numPendingReports: 19
};

selectors.keywords = {
	value: '',
	onChangeKeywords: () => {}
};
selectors.onChangeSort = (prop, isDesc) => {
	if (isDesc !== false && isDesc !== true) {
		isDesc = selectors.searchSort.selectedSort.isDesc;
	}
	module.exports.update({
		searchSort: {
			...selectors.searchSort,
			selectedSort: {
				prop: prop || selectors.selectedSort.prop,
				isDesc
			}
		}
	});
};

selectors.pagination = {
	numPerPage: 10,
	numPages: 10,
	selectedPageNum: 1,
	nextPageNum: 2,
	startItemNum: 1,
	endItemNum: 10,
	numUnpaginated: 89,
	nextItemNum: 11,
	onUpdateSelectedPageNum: (selectedPageNum) => module.exports.update({
		pagination: {
			...selectors.pagination,
			selectedPageNum,
			nextPageNum: selectedPageNum + 1,
			previousPageNum: selectedPageNum - 1,
			startItemNum: ((selectedPageNum - 1) * 10) + 1,
			endItemNum: selectedPageNum * 10,
			nextItemNum: selectedPageNum * 10 + 1,
			previousItemNum: ((selectedPageNum - 2) * 10) + 1
		}
	})
};

selectors.createMarketForm =  {};

module.exports = selectors;


