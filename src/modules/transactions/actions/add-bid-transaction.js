import { formatPercent, formatShares, formatEther, formatRealEther } from '../../../utils/format-number';
import { BID } from '../../transactions/constants/types';
import { abi } from '../../../services/augurjs';
import { addTransaction } from '../../transactions/actions/add-transactions';
import { processBid } from '../../trade/actions/process-bid';

export const addBidTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth) => (
	(dispatch, getState) => {
		dispatch(addTransaction(makeBidTransaction(marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch)));
	}
);

export const makeBidTransaction = (marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth, dispatch) => {
	console.log('bid transaction:', marketID, outcomeID, marketType, marketDescription, outcomeName, numShares, limitPrice, totalCost, tradingFeesEth, feePercent, gasFeesRealEth);
	const transaction = {
		type: BID,
		data: {
			marketID,
			outcomeID,
			marketType,
			marketDescription,
			outcomeName
		},
		numShares: formatShares(numShares),
		noFeePrice: formatEther(limitPrice),
		avgPrice: formatEther(abi.bignum(totalCost).dividedBy(abi.bignum(numShares))),
		tradingFees: formatEther(tradingFeesEth),
		feePercent: formatPercent(feePercent),
		gasFees: formatRealEther(gasFeesRealEth)
	};

	transaction.action = (transactionID) => dispatch(processBid(
		transactionID,
		marketID,
		outcomeID,
		numShares,
		limitPrice,
		totalCost,
		tradingFeesEth,
		gasFeesRealEth));

	return transaction;
};
