import memoizerific from 'memoizerific';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../modules/app/constants/pages';

export default function () {
	const { links } = require('../../../selectors');

	return selectPortfolioNavItems(links);
}

export const selectPortfolioNavItems = memoizerific(1)(links => (
	[
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
		}
	]
));
