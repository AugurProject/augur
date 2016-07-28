import { formatShares, formatEther } from '../../../utils/format-number';

import { BUY, SELL } from '../../trade/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBuy } from '../../trade/actions/process-buy';
import { processSell } from '../../trade/actions/process-sell';

export const addTradeTransaction = (type, marketID, outcomeID, marketDescription, outcomeName, outcomeTradeInProgress) => {
	return (dispatch, getState) => {
		dispatch(addTransaction(makeTradeTransaction(type, marketID, outcomeID, marketDescription, outcomeName, outcomeTradeInProgress, dispatch)));
	};
};

export const makeTradeTransaction = (type, marketID, outcomeID, marketDescription, outcomeName, outcomeTradeInProgress, dispatch) => {
	let transaction = {
		type: type,
		data: {
			marketID: marketID,
			outcomeID: outcomeID,
			marketDescription: marketDescription,
			outcomeName: outcomeName,
			numShares: formatShares(outcomeTradeInProgress.numShares),
			avgPrice: formatEther(outcomeTradeInProgress.limitPrice)
		}
	};

	if (outcomeTradeInProgress.side === BUY) {
		transaction.action = (transactionID) => dispatch(processBuy(
				transactionID,
				marketID,
				outcomeID,
				outcomeTradeInProgress.numShares,
				outcomeTradeInProgress.limitPrice,
				outcomeTradeInProgress.totalCost));

	}
	else if (outcomeTradeInProgress.side === SELL) {
		transaction.action = (transactionID) => dispatch(processSell(
				transactionID,
				marketID,
				outcomeID,
				outcomeTradeInProgress.numShares,
				outcomeTradeInProgress.limitPrice,
				outcomeTradeInProgress.totalCost));
	}

	return transaction;
};
