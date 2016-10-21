import links from 'selectors/links';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from 'modules/site/constants/views';

import makeNumber from 'utils/make-number';
import { randomNum } from 'utils/random-number';

export default [
	{
		label: 'Positions',
		link: links.myPositionsLink,
		page: MY_POSITIONS,
		leadingTitle: 'Total Positions',
		leadingValue: makeNumber(Math.round(randomNum()), 'positions'),
		trailingTitle: 'Total Gain/Loss',
		trailingValue: makeNumber(randomNum(), ' ETH')
	},
	{
		label: 'Markets',
		link: links.myMarketsLink,
		page: MY_MARKETS,
		leadingTitle: 'Total Markets',
		leadingValue: makeNumber(Math.round(randomNum()), 'markets'),
		trailingTitle: 'Total Gain/Loss',
		trailingValue: makeNumber(randomNum(), ' ETH')
	},
	{
		label: 'Reports',
		link: links.myReportsLink,
		page: MY_REPORTS,
		leadingTitle: 'Total Reports',
		leadingValue: makeNumber(Math.round(randomNum()), 'reports'),
		trailingTitle: 'Total Gain/Loss',
		trailingValue: makeNumber(randomNum(), ' REP')
	}
];
