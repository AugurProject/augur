import { formatShares, formatEther, formatRealEther } from '../../../utils/format-number';

import { SHORT_SELL } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processShortSell } from '../../trade/actions/process-short-sell';

export const addShortSellTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeShortSellTransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch)));
	}
);

export const makeShortSellTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch) => {
	const transaction = {
		type: SHORT_SELL,
		data: {
			marketID,
			marketLink,
			outcomeID,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice),
			tradingFees: formatEther(tradingFeesEth),
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
