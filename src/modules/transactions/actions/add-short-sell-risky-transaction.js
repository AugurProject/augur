import { formatShares, formatEther } from '../../../utils/format-number';

import { SHORT_SELL_RISKY } from '../../transactions/constants/types';

import { addTransaction } from '../../transactions/actions/add-transactions';
import { processShortSellRisky } from '../../trade/actions/process-short-sell-risky';

export const addShortSellRiskyTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeShortSellRiskyTransaction(marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, dispatch)));
	}
);

export const makeShortSellRiskyTransaction = (marketID, outcomeID, marketDescription, outcomeName, numShares, limitPrice, dispatch) => {
	const transaction = {
		type: SHORT_SELL_RISKY,
		data: {
			marketID,
			outcomeID,
			marketDescription,
			outcomeName,
			numShares: formatShares(numShares),
			avgPrice: formatEther(limitPrice)
		}
	};

	transaction.action = (transactionID) => dispatch(processShortSellRisky(
		transactionID,
		marketID,
		outcomeID,
		numShares,
		limitPrice));

	return transaction;
};
