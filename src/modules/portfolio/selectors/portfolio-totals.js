import { formatEther } from '../../../utils/format-number';
import selectMyPositionsSummary from '../../../modules/my-positions/selectors/my-positions-summary';
import selectMyMarketsSummary from '../../../modules/my-markets/selectors/my-markets-summary';


export default function () {
	const positionsSummary = selectMyPositionsSummary();
	const marketsSummary = selectMyMarketsSummary();

	const totalValue = formatEther((positionsSummary && positionsSummary.totalValue && positionsSummary.totalValue.value || 0) + (marketsSummary && marketsSummary.totalValue || 0));
	const netChange = formatEther((positionsSummary && positionsSummary.netChange && positionsSummary.netChange.value || 0) + (marketsSummary && marketsSummary.totalValue || 0));

	return {
		totalValue,
		netChange
	};
}
