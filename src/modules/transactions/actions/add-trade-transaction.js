import { formatShares, formatEther } from '../../../utils/format-number';

import { BUY, SELL } from '../../trade/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBuy } from '../../trade/actions/process-buy';
import { processSell } from '../../trade/actions/process-sell';

export const addTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeTradeTransaction(type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, dispatch)));
	}
);

export const makeTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, dispatch) => {
	const transaction = {
		type,
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice)
		}
	};

	if (type === BUY) {
		transaction.action = (transactionID) => dispatch(processBuy(
				transactionID,
				marketID,
				outcomeID,
				numShares,
				limitPrice,
				totalCost));

	} else if (type === SELL) {
		transaction.action = (transactionID) => dispatch(processSell(
				transactionID,
				marketID,
				outcomeID,
				numShares,
				limitPrice,
				totalCost));
	}

	return transaction;
};
