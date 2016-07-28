import { formatEther, formatShares } from '../../../utils/format-number';
import { BID, ASK } from '../../transactions/constants/types';
import { processOrder } from '../../trade/actions/place-trade';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const addTradeTransaction = (isSell, market, outcome, numShares, totalCostWithoutFeeEther, feeEther, gas) => {
	(dispatch, getState) => {
		dispatch(
			addTransaction(
				makeTradeTransaction(
					isSell, market, outcome,
					numShares, totalCostWithoutFeeEther, feeEther,
					gas, dispatch
				)
			)
		);
	};
};

export const makeTradeTransaction = (type, market, outcome, shares, limitPrice, totalCostWithoutFeeEther, feeEth, gasEth, dispatch) => {
	const transaction = {
		type,
		shares: formatShares(shares),
		ether: formatEther(totalCostWithoutFeeEther + feeEth + gasEth),
		gas: formatEther(gasEth),
		data: {
			marketID: market.id,
			outcomeID: outcome.id,
			marketDescription: market.description,
			outcomeName: outcome.name,
			avgPrice: formatEther(totalCostWithoutFeeEther / shares)
		},
		action: (transactionID) => {
			const order = {
				type: transaction.type,
				outcomeID: transaction.data.outcomeID,
				limitPrice: transaction.limitPrice,
				etherToBuy: transaction.ether.value,
				sharesToSell: transaction.shares.value
			};
			dispatch(processOrder(transactionID, transaction.data.marketID, transaction.data.outcomeID, order));
		}
	};
	return transaction;
};