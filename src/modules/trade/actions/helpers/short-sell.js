import async from 'async';
import { augur, abi } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';

export function shortSell(marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb) {
	const res = {
		remainingShares: numShares,
		filledShares: ZERO,
		filledEth: ZERO
	};

	const matchingIDs = getTradeIDs();

	if (!matchingIDs.length) return cb(null, res);

	console.log('* short_sell inputs:', 'marketID', marketID, 'outcomeID', outcomeID, 'max_amount', numShares, 'buyer_trade_id', matchingIDs);

	async.eachSeries(matchingIDs, (matchingID, nextMatchingID) => {
		augur.short_sell({
			max_amount: res.remainingShares.toFixed(),
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
				if (data.unmatchedShares) {
					res.remainingShares = parseFloat(data.unmatchedShares);
				} else {
					res.remainingShares = 0;
				}
				if (data.matchedShares) {
					res.filledShares = res.filledShares.plus(abi.bignum(data.matchedShares));
				}
				if (data.cashFromTrade) {
					res.filledEth = res.filledEth.plus(data.cashFromTrade);
				}
				if (res.remainingShares > 0) return nextMatchingID();
				nextMatchingID({ isComplete: true });
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
