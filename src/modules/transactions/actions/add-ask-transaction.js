import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { ASK } from '../../transactions/constants/types';
import { abi } from '../../../services/augurjs';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { processAsk } from '../../trade/actions/process-ask';

export const addAskTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeAskTransaction(marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch)));
	}
);

export const makeAskTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	console.log('ask transaction:', marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth);
	const transaction = {
		type: ASK,
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

	transaction.action = (transactionID) => dispatch(processAsk(
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
