import * as AugurJS from '../../../services/augurjs';
import { SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function processSell(transactionID, marketID, outcomeID, numShares, limitPrice, totalEthWithFee) {
	return (dispatch, getState) => {
		if ((!limitPrice) || !numShares) {
			return dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: `Invalid limit price "${limitPrice}" or shares "${numShares}"` }));
		}

		const { marketOrderBooks } = getState();
		const marketOrderBookBuys = marketOrderBooks[marketID] && marketOrderBooks[marketID].buy || {};
		const matchingSortedBidIDs = Object.keys(marketOrderBookBuys)
			.map(bidID => marketOrderBookBuys[bidID])
			.filter(bid => bid.outcome === outcomeID && parseFloat(bid.price) >= limitPrice)
			.sort((order1, order2) => order1.price < order2.price ? 1 : 0)
			.map(bid => bid.id);

		AugurJS.trade({
			max_value: 0,
			max_amount: numShares,
			trade_ids: matchingSortedBidIDs,
			onTradeHash: data => dispatch(updateExistingTransaction(transactionID, { status: 'submitting...' })),
			onCommitSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'committing...' })),
			onCommitSuccess: data => dispatch(updateExistingTransaction(transactionID, { status: 'sending...' })),
			onCommitFailed: data => dispatch(updateExistingTransaction(transactionID, { status: FAILED, message: data.message })),
			onNextBlock: data => console.log('!!! onNextBlock', data),
			onTradeSent: data => dispatch(updateExistingTransaction(transactionID, { status: 'processing...' })),
			onTradeSuccess: data => {
				console.log('!! onTradeSuccess', data);
				dispatch(updateExistingTransaction(transactionID, { status: SUCCESS }));
			}
		});
	};
}
