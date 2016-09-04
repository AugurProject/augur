import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';

import { SHORT_SELL } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processShortSell } from '../../trade/actions/process-short-sell';

export const addShortSellTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeShortSellTransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch)));
	}
);

export const makeShortSellTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	const transaction = {
		type: SHORT_SELL,
		data: {
			marketID,
			outcomeID,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice),
			tradingFees: formatEther(tradingFeesEth),
			feePercent: formatPercent(feePercent),
			gasFees: formatRealEther(gasFeesRealEth)
		}
	};

	transaction.action = (transactionID) => dispatch(processShortSell(
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
