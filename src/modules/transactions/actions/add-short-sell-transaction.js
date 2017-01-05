import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { SHORT_SELL } from '../../transactions/constants/types';
import { abi } from '../../../services/augurjs';

export const makeShortSellTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	const bnNumShares = abi.bignum(numShares);
	return {
		type: SHORT_SELL,
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost)
			.minus(bnNumShares)
			.dividedBy(bnNumShares)
			.abs()),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};
};
