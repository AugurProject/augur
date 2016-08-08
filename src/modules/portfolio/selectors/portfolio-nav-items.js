import memoizerific from 'memoizerific';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../../modules/app/constants/pages';
import { formatNumber, formatEther } from '../../../utils/format-number';
import selectMyPositionsSummary from '../../../modules/my-positions/selectors/my-positions-summary';
import selectMyMarketsSummary from '../../../modules/my-markets/selectors/my-markets-summary';

export default function () {
	const { links } = require('../../../selectors');

	return selectPortfolioNavItems(links);
}

export const selectPortfolioNavItems = memoizerific(1)((links) => {
	const positionsSummary = selectMyPositionsSummary();
	const marketsSummary = selectMyMarketsSummary();

	return [
		{
			label: 'Positions',
			link: links.myPositionsLink,
			page: MY_POSITIONS,
			leadingTitle: 'Total Positions',
			leadingValue: formatNumber((positionsSummary && positionsSummary.numPositions || 0), { denomination: 'positions' }),
			trailingTitle: 'Total Gain/Loss',
			trailingValue: formatEther((positionsSummary && positionsSummary.netChange || 0), 'eth')
		},
		{
			label: 'Markets',
			link: links.myMarketsLink,
			page: MY_MARKETS,
			leadingTitle: 'Total Markets',
			leadingValue: formatNumber((marketsSummary && marketsSummary.numMarkets || 0), { denomination: 'markets' }),
			trailingTitle: 'Total Gain/Loss',
			trailingValue: formatEther((marketsSummary && marketsSummary.totalValue || 0), 'eth')
		},
		{
			label: 'Reports',
			link: links.myReportsLink,
			page: MY_REPORTS
		}
	];
});
