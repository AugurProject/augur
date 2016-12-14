import memoizerific from 'memoizerific';
import { MY_POSITIONS, MY_MARKETS, MY_REPORTS } from '../../app/constants/views';
import { formatNumber, formatEther, formatRep } from '../../../utils/format-number';
import selectMyPositionsSummary from '../../my-positions/selectors/my-positions-summary';
import selectMyMarketsSummary from '../../my-markets/selectors/my-markets-summary';
import selectMyReportsSummary from '../../my-reports/selectors/my-reports-summary';

export default function () {
	const { links } = require('../../../selectors');

	return selectPortfolioNavItems(links);
}

export const selectPortfolioNavItems = memoizerific(1)((links) => {
	const positionsSummary = selectMyPositionsSummary();
	const marketsSummary = selectMyMarketsSummary();
	const reportsSummary = selectMyReportsSummary();

	return [
		{
			label: 'Positions',
			link: links.myPositionsLink,
			page: MY_POSITIONS,
			leadingTitle: 'Total Number of Positions',
			leadingValue: (positionsSummary && positionsSummary.numPositions) || 0,
			trailingTitle: 'Total Profit/Loss',
			trailingValue: (positionsSummary && positionsSummary.totalNet) || 0
		},
		{
			label: 'Markets',
			link: links.myMarketsLink,
			page: MY_MARKETS,
			leadingTitle: 'Total Markets',
			leadingValue: formatNumber(((marketsSummary && marketsSummary.numMarkets) || 0), { denomination: 'markets' }),
			trailingTitle: 'Total Gain/Loss',
			trailingValue: formatEther(((marketsSummary && marketsSummary.totalValue) || 0), { denomination: 'eth' })
		},
		{
			label: 'Reports',
			link: links.myReportsLink,
			page: MY_REPORTS,
			leadingTitle: 'Total Reports',
			leadingValue: formatNumber((reportsSummary && reportsSummary.numReports), { denomination: 'reports' }),
			trailingTitle: 'Total Gain/Loss',
			trailingValue: formatRep((reportsSummary && reportsSummary.netRep), { denomination: 'rep' })
		}
	];
});
