import { formatShares, formatEther, formatRealEther } from '../../../utils/format-number';

import { BID } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBid } from '../../trade/actions/process-bid';

export const addBidTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeBidTransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch)));
	}
);

export const makeBidTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch) => {
	const transaction = {
		type: BID,
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

	transaction.action = (transactionID) => dispatch(processBid(
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
