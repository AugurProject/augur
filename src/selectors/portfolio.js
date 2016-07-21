import links from '../selectors/links';
import { makeNumber } from '../utils/make-number';
import { makeDate } from '../utils/make-date';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../modules/site/constants/pages';

const navItems = [
	{
		default: true,
		label: 'My Positions',
		link: links.myPositionsLink,
		page: MY_POSITIONS
	},
	{
		label: 'My Markets',
		link: links.myMarketsLink,
		page: MY_MARKETS
	},
	{
		label: 'My Reports',
		link: links.myReportsLink,
		page: MY_REPORTS
	},
];

const summaries = [
	{
		label: 'Total Value',
		value: '212.38 ETH'
	},
	{
		label: 'Total Gain/Loss',
		value: '+9.5 ETH'
	},
	{
		label: 'Fees Paid',
		value: '0.201 ETH'
	},
	{
		label: 'Fees Earned',
		value: '1.77 ETH'
	}
];

const myMarkets = [
	{
		description: 'market 1',
		endData: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10),
		volume: makeNumber(Math.random() * 100),
		numberOfTrades: makeNumber(Math.random() * 1000),
		openVolume: makeNumber(Math.random() * 10000)
	},
	{
		description: 'market 2',
		endData: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10),
		volume: makeNumber(Math.random() * 100),
		numberOfTrades: makeNumber(Math.random() * 1000),
		openVolume: makeNumber(Math.random() * 10000)
	},
	{
		description: 'market 3',
		endData: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10),
		volume: makeNumber(Math.random() * 100),
		numberOfTrades: makeNumber(Math.random() * 1000),
		openVolume: makeNumber(Math.random() * 10000)
	}
];

export default {
	navItems,
	summaries,
	myMarkets
};
