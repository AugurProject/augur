import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { SHORT_SELL } from '../../transactions/constants/types';
import { abi } from '../../../services/augurjs';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { processShortSell } from '../../trade/actions/process-short-sell';

export const addShortSellTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeShortSellTransaction(marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch)));
	}
);

export const makeShortSellTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	console.log('short sell transaction:', marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth);
	const bnNumShares = abi.bignum(numShares);
	const transaction = {
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

	transaction.action = transactionID => dispatch(processShortSell(
		transactionID,
		marketID,
		outcomeID,
		numShares,
		limitPrice,
		totalCost,
		tradingFeesEth,
		gasFeesRealEth));

	return transaction;
};
