import { augur } from '../../../../services/augurjs';

// if buying numShares must be 0, if selling totalEthWithFee must be 0
export function tradeRecursively(marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cbStatus, cbFill, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares,
		filledShares: 0,
		filledEth: 0
	};

	const matchingIDs = getTradeIDs();

	if (!matchingIDs.length) {
		return cb(null, res);
	}

	console.log('** trade inputs:', 'marketID', marketID, 'outcomeID', outcomeID, 'max_amount', numShares, 'max_value', totalEthWithFee, 'trade_ids', matchingIDs);

	augur.trade({
		max_value: totalEthWithFee,
		max_amount: numShares,
		trade_ids: matchingIDs,
		sender: takerAddress,

		onTradeHash: data => cbStatus('submitting'),

		onCommitSent: data => cbStatus('committing'),
		onCommitSuccess: data => cbStatus('sending'),
		onCommitFailed: err => { console.log('!!!! onCommitFailed', err); cb(err); },

		onNextBlock: data => console.log('trade-onNextBlock', data),

		onTradeSent: data => { console.log('!!!! onTradeSent', data); cbStatus('filling'); },
		onTradeSuccess: doSuccess,
		onTradeFailed: err => { console.log('!!!! onTradeFailed', err); cb(err); }
	});

	function doSuccess(data) {
		res.remainingEth = parseFloat(data.unmatchedCash) || 0;
		res.remainingShares = parseFloat(data.unmatchedShares) || 0;
		res.filledShares = parseFloat(data.sharesBought) || 0;
		res.filledEth = parseFloat(data.cashFromTrade) || 0;

		console.log('** trade success data:', data, res);
		if ((res.filledEth && res.remainingEth) || (res.filledShares && res.remainingShares)) {
			cbFill(res);
			return tradeRecursively(marketID, outcomeID, res.remainingShares, res.remainingEth, takerAddress, getTradeIDs, cbStatus, cbFill, cb);
		}
		return cb(null, res);
	}
}
