import { myPositionsLink, myMarketsLink, myReportsLink } from '../selectors/links';

const NAV_ITEMS = [
	{
		href: '/my-positions',
		label: 'My Positions',
		link: myPositionsLink,
		default: true
	},
	{
		href: '/my-markets',
		label: 'My Markets',
		link: myMarketsLink
	},
	{
		href: '/my-reports',
		label: 'My Reports',
		link: myReportsLink
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
