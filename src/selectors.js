import authForm from './selectors/auth-form';
import createMarketForm from './selectors/create-market-form';
import filters from './selectors/filters';
import keywords from './selectors/keywords';
import loginAccount from './selectors/login-account';
import markets from './selectors/markets';
import marketsTotals from './selectors/markets-totals';
import positionsMarkets from './selectors/positions-markets';
import positionsSummary from './selectors/positions-summary';

import { ACCOUNT, MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { LOGIN } from './modules/auth/constants/auth-types';
import { BID, ASK } from './modules/transactions/constants/types';

// all selectors should go here
const selectors = {
	authForm,
	createMarketForm,
	filters,
	keywords,
	loginAccount,
	markets,
	marketsTotals,
	positionsSummary,
	positionsMarkets
};

// add update helper fn to selectors object
Object.defineProperty(selectors, 'update', {
	value: (newState = {}) => {
		console.log('*** update', newState);
		Object.keys(newState).forEach(key => {
			selectors[key] = newState[key];
		});
		selectors.render();
	},
	enumerable: false
});

selectors.activePage = MARKETS;

selectors.links = {
	authLink: { href: '', onClick: () => module.exports.update({ activePage: LOGIN }) },
	marketsLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	positionsLink: { href: '', onClick: () => module.exports.update({ activePage: POSITIONS }) },
	transactionsLink: { href: '', onClick: () => module.exports.update({ activePage: TRANSACTIONS }) },
	marketLink: { href: '', onClick: () => module.exports.update({ activePage: M }) },
	previousLink: { href: '', onClick: () => module.exports.update({ activePage: MARKETS }) },
	createMarketLink: { href: '', onClick: () => module.exports.update({ activePage: MAKE }) },
	accountLink: { href: '', onClick: () => module.exports.update({ activePage: ACCOUNT }) }
};

selectors.transactions = [];
selectors.transactionsTotals = {
	title: '0 Transactions'
};
selectors.isTransactionsWorking = false;


selectors.searchSort = {
	selectedSort: { prop: 'creationDate', isDesc: true },
	sortOptions: [{ label: 'Creation Date', value: 'creationDate' }, { label: 'End Date', value: 'endDate' }, { label: 'Highest Maker Fee', value: 'makerFeePercent' }]
};

selectors.marketsHeader = {};

selectors.market = {}; // selected market
selectors.sideOptions = [{ value: BID, label: 'Buy' }, { value: ASK, label: 'Sell' }];
selectors.selectedOutcome = {
	updateSelectedOutcome: (selectedOutcomeID) => {
		module.exports.update({
			selectedOutcome: {
				...selectors.selectedOutcome,
				selectedOutcomeID
			}
		});
	},
	selectedOutcomeID: null
};

selectors.searchSort.onChangeSort = (prop, isDesc) => {
	let isDescending = isDesc;
	if (isDesc !== false && isDesc !== true) {
		isDescending = selectors.searchSort.selectedSort.isDesc;
	}
	module.exports.update({
		searchSort: {
			...selectors.searchSort,
			selectedSort: {
				prop: prop || selectors.selectedSort.prop,
				isDesc: isDescending
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

module.exports = selectors;
