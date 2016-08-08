import { formatEther } from '../../../utils/format-number';
import selectMyPositionsSummary from '../../../modules/my-positions/selectors/my-positions-summary';
import selectMyMarketsSummary from '../../../modules/my-markets/selectors/my-markets-summary';


export default function () {
	const positionsSummary = selectMyPositionsSummary();
	const marketsSummary = selectMyMarketsSummary();

	const value = formatEther((positionsSummary && positionsSummary.totalValue || 0) + (marketsSummary && marketsSummary.totalValue || 0));
	const net = formatEther((positionsSummary && positionsSummary.netChange || 0) + (marketsSummary && marketsSummary.totalValue || 0));

	return {
		value,
		net
	};
}
