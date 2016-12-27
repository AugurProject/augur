import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { BUY, SELL } from '../../trade/constants/types';
import { abi } from '../../../services/augurjs';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBuy } from '../../trade/actions/process-buy';
import { processSell } from '../../trade/actions/process-sell';

export const addTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeTradeTransaction(type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch)));
	}
);

export const makeTradeTransaction = (type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	console.log('trade transaction:', type, marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth);
	const transaction = {
		type,
		description: marketDescription,
		data: {
			marketID,
			outcomeID,
			marketType,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};

	if (type === BUY) {
		transaction.action = transactionID => dispatch(processBuy(
				transactionID,
				marketID,
				outcomeID,
				numShares,
				limitPrice,
				totalCost,
				tradingFeesEth,
				gasFeesRealEth));

	} else if (type === SELL) {
		transaction.action = transactionID => dispatch(processSell(
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
