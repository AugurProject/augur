import { formatShares, formatEther, formatRealEther } from '../../../utils/format-number';

import { BUY, SELL } from '../../trade/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBuy } from '../../trade/actions/process-buy';
import { processSell } from '../../trade/actions/process-sell';

export const addTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeTradeTransaction(type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch)));
	}
);

export const makeTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, gasFeesRealEth, dispatch) => {
	const transaction = {
		type,
		data: {
			marketID,
			marketLink,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice),
			tradingFees: formatEther(tradingFeesEth),
			gasFees: formatRealEther(gasFeesRealEth)
		}
	};

	if (type === BUY) {
		transaction.action = (transactionID) => dispatch(processBuy(
				transactionID,
				marketID,
				outcomeID,
				numShares,
				limitPrice,
				totalCost,
				tradingFeesEth,
				gasFeesRealEth));

	} else if (type === SELL) {
		transaction.action = (transactionID) => dispatch(processSell(
				transactionID,
				marketID,
				outcomeID,
				numShares,
				limitPrice,
				totalCost,
				tradingFeesEth,
				gasFeesRealEth));
	}

	return transaction;
};
