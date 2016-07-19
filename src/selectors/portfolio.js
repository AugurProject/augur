import links from '../selectors/links';

const NAV_ITEMS = [
	{
		default: true,
		label: 'My Positions',
		link: links.myPositionsLink,
	},
	{
		label: 'My Markets',
		link: links.myMarketsLink
	},
	{
		label: 'My Reports',
		link: links.myReportsLink
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

const PORTFOLIO = {
	navItems: NAV_ITEMS,
	summaries: SUMMARIES
};

export default PORTFOLIO;
