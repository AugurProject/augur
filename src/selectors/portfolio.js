import links from '../selectors/links';
import { PORTFOLIO, MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../modules/site/constants/pages';

const NAV_ITEMS = [
	{
		default: true,
		label: 'My Positions',
		link: links.myPositionsLink,
		page: [PORTFOLIO, MY_POSITIONS]
	},
	{
		label: 'My Markets',
		link: links.myMarketsLink,
		page: [MY_MARKETS]
	},
	{
		label: 'My Reports',
		link: links.myReportsLink,
		page: [MY_REPORTS]
	},
];

const SUMMARIES = [
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
	},
];

const PORTFOLIO_OBJECT = {
	navItems: NAV_ITEMS,
	summaries: SUMMARIES
};

export default PORTFOLIO_OBJECT;
