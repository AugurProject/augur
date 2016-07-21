import links from '../selectors/links';
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

export default {
	navItems,
	summaries
};
