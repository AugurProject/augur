import async from 'async';
import { augur } from '../../../../services/augurjs';

export function shortSellRecursively(marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cbFill, cb) {
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
			max_amount: numShares,
			buyer_trade_id: matchingID,
			sender: takerAddress,

			onTradeHash: data => cbStatus('submitting'),

			onCommitSent: data => cbStatus('committing'),
			onCommitSuccess: data => cbStatus('sending'),
			onCommitFailed: err => { console.log('!!!! onCommitFailed', err); nextMatchingID(err); },

			onNextBlock: data => console.log('short_sell-onNextBlock', data),

			onTradeSent: data => { console.log('!!!! onTradeSent', data); cbStatus('filling'); },
			onTradeSuccess: data => {
				res.remainingShares = parseFloat(data.unmatchedShares) || 0;
				res.filledShares += parseFloat(data.matchedShares) || 0;
				res.filledEth += parseFloat(data.cashFromTrade) || 0;
				nextMatchingID();
			},
			onTradeFailed: err => { console.log('!!!! onTradeFailed', err); nextMatchingID(err); }
		});
	}, err => {
		if (err) return cb(err);
		console.log('* short_sell success data:', res);
		if (res.filledShares && res.remainingShares) {
			cbFill(res);
			return shortSellRecursively(marketID, outcomeID, res.remainingShares, takerAddress, getTradeIDs, cbStatus, cbFill, cb);
		}
		return cb(null, res);
	});
}
