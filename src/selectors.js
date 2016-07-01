import loginAccount from './selectors/login-account';
import markets from './selectors/markets';
import keywords from './selectors/keywords';
import filters from './selectors/filters';
import createMarketForm from './selectors/create-market-form';

import { MARKETS, MAKE, POSITIONS, TRANSACTIONS, M } from './modules/site/constants/pages';
import { LOGIN } from './modules/auth/constants/auth-types';
import {
	BID,
	ASK
} from './modules/transactions/constants/types';

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
	createMarketForm
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
selectors.marketsTotals = {
	positionsSummary: { numPositions:
   { value: 100,
     formattedValue: 100,
     formatted: '100',
     roundedValue: 100,
     rounded: '100',
     minimized: '100',
     denomination: 'Positions',
     full: '100Positions' },
  qtyShares:
   { value: 500,
     formattedValue: 500,
     formatted: '500',
     roundedValue: 500,
     rounded: '500',
     minimized: '500',
     denomination: 'Shares',
     full: '500Shares' },
  purchasePrice:
   { value: 20,
     formattedValue: 20,
     formatted: '+20.00',
     roundedValue: 20,
     rounded: '+20.0',
     minimized: '+20',
     denomination: 'Eth',
     full: '+20.00Eth' },
  totalValue:
   { value: 1000,
     formattedValue: 1000,
     formatted: '+1,000.00',
     roundedValue: 1000,
     rounded: '+1,000.0',
     minimized: '+1,000',
     denomination: 'Eth',
     full: '+1,000.00Eth' },
  totalCost:
   { value: 10000,
     formattedValue: 10000,
     formatted: '+10,000.00',
     roundedValue: 10000,
     rounded: '+10,000.0',
     minimized: '+10,000',
     denomination: 'Eth',
     full: '+10,000.00Eth' },
  shareChange:
   { value: -18,
     formattedValue: -18,
     formatted: '-18.00',
     roundedValue: -18,
     rounded: '-18.0',
     minimized: '-18',
     denomination: 'Eth',
     full: '-18.00Eth' },
  gainPercent:
   { value: -90,
     formattedValue: -90,
     formatted: '-90.0',
     roundedValue: -90,
     rounded: '-90',
     minimized: '-90',
     denomination: '%',
     full: '-90.0%' },
  netChange:
   { value: -9000,
     formattedValue: -9000,
     formatted: '-9,000.00',
     roundedValue: -9000,
     rounded: '-9,000.0',
     minimized: '-9,000',
     denomination: 'Eth',
     full: '-9,000.00Eth' },
	positions: 50 },
	numAll: 6,
	numFavorites: 4,
	numPendingReports: 3,
	numUnpaginated: 7,
	numFiltered: 7,
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
