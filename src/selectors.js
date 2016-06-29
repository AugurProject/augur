import loginAccount from './selectors/login-account';
import markets from './selectors/markets';
import keywords from './selectors/keywords';
import filters from './selectors/filters';
import createMarketForm from './selectors/create-market-form';
import marketsTotals from './selectors/markets-totals';
import positionsSummary from './selectors/positions-summary';
import positionsMarkets from './selectors/positions-markets';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { LOGIN } from './modules/auth/constants/auth-types';

const selectors = {
	update: (newState = {}) => {
		console.log('*** update', newState);
		Object.keys(newState).forEach(key => {
			selectors[key] = newState[key];
		});
		selectors.render();
	},
	loginAccount,
	markets,
	keywords,
	filters,
	createMarketForm,
	marketsTotals,
	positionsSummary,
	positionsMarkets
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

selectors.authForm = { closeLink: { href: '/', onClick: () => {} } };

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
selectors.sideOptions = [{ value: 'bid', label: 'Buy' }, { value: 'ask', label: 'Sell' }];
selectors.selectedOutcome = {
	updateSelectedOutcome: (selectedOutcomeID) => {
		module.exports.update({
			selectedOutcome: {
				...selectors.selectedOutcome,
				selectedOutcomeID: selectors.selectedOutcome.selectedOutcomeID !== selectedOutcomeID ? selectedOutcomeID : null
			}
		});
	},
	selectedOutcomeID: null
};

selectors.onChangeSort = (prop, isDesc) => {
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
selectors.searchSort.onChangeSort = selectors.onChangeSort;
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
