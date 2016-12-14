import { formatEther } from '../../../utils/format-number';
import selectMyPositionsSummary from '../../../modules/my-positions/selectors/my-positions-summary';
import selectMyMarketsSummary from '../../../modules/my-markets/selectors/my-markets-summary';
import { abi } from '../../../services/augurjs';

export default function () {
	const positionsSummary = selectMyPositionsSummary();
	const marketsSummary = selectMyMarketsSummary();

	const totalValue = formatEther(abi.bignum((positionsSummary && positionsSummary.totalValue && positionsSummary.totalValue.value) || 0).plus(abi.bignum((marketsSummary && marketsSummary.totalValue) || 0)));
	const netChange = formatEther(abi.bignum((positionsSummary && positionsSummary.netChange && positionsSummary.netChange.value) || 0).plus(abi.bignum((marketsSummary && marketsSummary.totalValue) || 0)));

	return {
		totalValue,
		netChange
	};
}
