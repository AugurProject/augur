import { formatEther, formatShares } from '../../../utils/format-number';
import {
	BID,
	ASK,
	BUY_SHARES
} from '../../transactions/constants/types';
import { processOrder } from '../../trade/actions/place-trade';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeTradeTransaction =
(isSell, market, outcome, numShares, limitPrice, totalCostWithoutFeeEther, feeEther, gas, dispatch) => {
	const totalEther = totalCostWithoutFeeEther + feeEther;
	const profitLoss = !isSell ? -(numShares * limitPrice) : numShares * limitPrice;

	const txn = {
		type: !isSell ? BID : ASK,
		shares: numShares,
		sharesNegative: formatShares(-numShares),
		limitPrice,
		ether: totalEther,
		etherNegative: formatEther(-totalEther),
		feeToPay: formatEther(0),
		profitLoss: formatEther(profitLoss),
		gas,
		data: {
			marketID: market.id,
			outcomeID: outcome.id,
			marketDescription: market.description,
			outcomeName: outcome.name,
			avgPrice: formatEther(totalCostWithoutFeeEther / numShares)
		},
		action: (transactionID) => {
			const order = {
				type: txn.type === BUY_SHARES ? 'buy' : 'sell',
				outcomeID: txn.data.outcomeID,
				limitPrice: txn.limitPrice,
				etherToBuy: txn.ether.value,
				sharesToSell: txn.shares.value
			};
			dispatch(processOrder(transactionID, txn.data.marketID, txn.data.outcomeID, order));
		}
	};
	return txn;
};

export const addTradeTransaction =
(isSell, market, outcome, numShares, totalCostWithoutFeeEther, feeEther, gas) =>
  (dispatch, getState) =>
    dispatch(
			addTransaction(
				makeTradeTransaction(
					isSell, market, outcome,
					numShares, totalCostWithoutFeeEther, feeEther,
					gas, dispatch
				)
			)
		);
