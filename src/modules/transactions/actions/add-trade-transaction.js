import { formatEther } from '../../../utils/format-number';
import {
BUY_SHARES,
SELL_SHARES,
// BID_SHARES,
// ASK_SHARES
} from '../../transactions/constants/types';
import { tradeShares } from '../../trade/actions/place-trade';
import { addTransaction } from '../../transactions/actions/add-transactions';

export const makeTradeTransaction =
(isSell, market, outcome, numShares, totalCostWithoutFeeEther, feeEther, gas, dispatch) => {
	const obj = {
		type: !isSell ? BUY_SHARES : SELL_SHARES,
		shares: numShares,
		ether: totalCostWithoutFeeEther + feeEther,
		gas,
		data: {
			marketID: market.id,
			outcomeID: outcome.id,
			marketDescription: market.description,
			outcomeName: outcome.name,
			avgPrice: formatEther(totalCostWithoutFeeEther / numShares),
			feeToPay: formatEther(feeEther)
		},
		action: (transactionID) =>
			dispatch(
				tradeShares(
					transactionID, market.id,
					outcome.id, numShares,
					null, null
				)
			)
	};
	return obj;
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
