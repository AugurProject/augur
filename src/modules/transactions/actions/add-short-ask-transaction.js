import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { SHORT_ASK } from '../../transactions/constants/types';
import { abi } from '../../../services/augurjs';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { processShortAsk } from '../../trade/actions/process-short-ask';

export const addShortAskTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeShortAskTransaction(marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch)));
	}
);

export const makeShortAskTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	console.log('short ask transaction:', marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth);
	const transaction = {
		type: SHORT_ASK,
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};

	transaction.action = (transactionID) => dispatch(processShortAsk(
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
