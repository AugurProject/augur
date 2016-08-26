import async from 'async';
import { augur } from '../../../../services/augurjs';

export function shortSell(marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb) {
	const res = {
		remainingShares: numShares,
		filledShares: 0,
		filledEth: 0
	};

	const matchingIDs = getTradeIDs();

	if (!matchingIDs.length) {
		return cb(null, res);
	}

	console.log('* short_sell inputs:', 'marketID', marketID, 'outcomeID', outcomeID, 'max_amount', numShares, 'buyer_trade_id', matchingIDs);

	async.eachSeries(matchingIDs, (matchingID, nextMatchingID) => {
		augur.short_sell({
			max_amount: res.remainingShares,
			buyer_trade_id: matchingID,
			sender: takerAddress,

			onTradeHash: data => cbStatus({ status: 'submitting' }),

			onCommitSent: data => cbStatus({ status: 'committing', hash: data.txHash }),
			onCommitSuccess: data => cbStatus({ status: 'sending' }),
			onCommitFailed: err => {
				console.log('!!!! onCommitFailed', err);
				nextMatchingID(err);
			},
			onNextBlock: data => console.log('short_sell-onNextBlock', data),

			onTradeSent: data => {
				console.log('!!!! onTradeSent', data);
				cbStatus({ status: 'filling', hash: data.txHash });
			},
			onTradeSuccess: data => {
				res.remainingShares = parseFloat(data.unmatchedShares) || 0;
				res.filledShares += parseFloat(data.matchedShares) || 0;
				res.filledEth += parseFloat(data.cashFromTrade) || 0;
				if (!res.remainingShares) return nextMatchingID({ isComplete: true });
				nextMatchingID();
			},
			onTradeFailed: err => {
				console.log('!!!! onTradeFailed', err);
				nextMatchingID(err);
			}
		});
	}, err => {
		if (err && !err.isComplete) return cb(err);
		console.log('* short_sell success:', res);
		return cb(null, res);
	});
}
