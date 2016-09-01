import { formatShares, formatEther, formatRealEther } from '../../../utils/format-number';

import { ASK } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processAsk } from '../../trade/actions/process-ask';

export const addAskTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeAskTransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch)));
	}
);

export const makeAskTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch) => {
	const transaction = {
		type: ASK,
		data: {
			marketID,
			outcomeID,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice),
			tradingFees: formatEther(tradingFeesEth),
			gasFees: formatRealEther(gasFeesRealEth)
		}
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
