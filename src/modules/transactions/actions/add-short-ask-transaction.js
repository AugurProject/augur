import { formatShares, formatEther } from '../../../utils/format-number';

import { SHORT_ASK } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processShortAsk } from '../../trade/actions/process-short-ask';

export const addShortAskTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeShortAskTransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, dispatch)));
	}
);

export const makeShortAskTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, dispatch) => {
	const transaction = {
		type: SHORT_ASK,
		data: {
			marketID,
			outcomeID,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice)
		}
	};

	transaction.action = (transactionID) => dispatch(processShortAsk(
		transactionID,
		marketID,
		outcomeID,
		numShares,
		limitPrice));

	return transaction;
};
