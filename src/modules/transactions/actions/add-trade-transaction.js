import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { abi } from '../../../services/augurjs';

export const makeTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => ({
	type,
	description: marketDescription,
	data: {
		marketID,
		outcomeID,
		marketType,
		outcomeName
	},
	numShares: formatShares(numShares),
	noFeePrice: formatEther(limitPrice),
	avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
	tradingFees: formatEther(tradingFeesEth),
	feePercent: formatPercent(feePercent),
	gasFees: formatRealEther(gasFeesRealEth)
});
