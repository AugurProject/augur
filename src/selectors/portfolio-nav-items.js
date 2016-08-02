import links from '../selectors/links';

import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../modules/site/constants/pages';

import { makeNumber } from '../../src/utils/make-number';

const randomSign = () => Math.random() < 0.5 ? -1 : 1;

export default [
	{
		label: 'Positions',
		link: links.myPositionsLink,
		page: MY_POSITIONS,
		leadingTitle: 'Total Positions',
		leadingValue: makeNumber(Math.round(Math.random() * 10)),
		trailingTitle: 'Total Gain/Loss',
		trailingValue: makeNumber(randomSign() * Math.random() * 3.7, 'eth')
	},
	{
		label: 'Markets',
		link: links.myMarketsLink,
		page: MY_MARKETS,
		leadingTitle: 'Total Markets',
		leadingValue: makeNumber(Math.round(Math.random() * 100)),
		trailingTitle: 'Total Gain/Loss',
		trailingValue: makeNumber(Math.random() * 1.3, 'eth')
	},
	{
		label: 'Reports',
		link: links.myReportsLink,
		page: MY_REPORTS,
		leadingTitle: 'Total Reports',
		leadingValue: makeNumber(Math.round(Math.random() * 1000)),
		trailingTitle: 'Total Gain/Loss',
		trailingValue: makeNumber(randomSign() * Math.random() * 1.3, 'rep')
	}
];
