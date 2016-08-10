import { formatShares, formatEther } from '../../../utils/format-number';

import { BID } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBid } from '../../trade/actions/process-bid';

export const addBidTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeBidransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, dispatch)));
	}
);

export const makeBidransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, totalCost, dispatch) => {
	const transaction = {
		type: BID,
		data: {
			marketID,
			outcomeID,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice)
		}
	};

	transaction.action = (transactionID) => dispatch(processBid(
		transactionID,
		marketID,
		outcomeID,
		numShares,
		limitPrice,
		totalCost));

	return transaction;
};
