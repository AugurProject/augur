import links from '../selectors/links';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../modules/site/constants/pages';

export default [
	{
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
