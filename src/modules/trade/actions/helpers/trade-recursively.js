import * as AugurJS from '../../../../services/augurjs';

export function tradeRecursively(marketID, outcomeID, numShares, totalEthWithFee, calculateTradeIDs, cbStatus, cbFill, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares
	};

	const matchingIDs = calculateTradeIDs();
	console.log('!!!!! matching ids:', matchingIDs);
	if (!matchingIDs.length) {
		return cb(null, res);
	}

	AugurJS.trade({
		max_value: totalEthWithFee,
		max_amount: 0,
		trade_ids: matchingIDs,

		onTradeHash: data => cbStatus('submitting'),
		onCommitSent: data => cbStatus('committing'),
		onCommitSuccess: data => cbStatus('sending'),

		onCommitConfirmed: data => console.log('trade-onCommitConfirmed', data),
		onCommitFailed: cb,

		onNextBlock: data => console.log('trade-onNextBlock', data),
		onTradeSent: data => cbStatus('filling'),
		onTradeSuccess: doSuccess,

		onTradeFailed: cb,
		onTradeConfirmed: doSuccess
	});

	function doSuccess(data) {
		res.remainingEth = parseFloat(data.unmatchedCash) || 0;
		res.remainingShares = parseFloat(data.unmatchedShares) || 0;
		console.log('**** unmatched eth/shares:', data);
		if (totalEthWithFee && res.remainingEth || numShares && res.remainingShares) {
			cbFill(res);
			return tradeRecursively(marketID, outcomeID, res.remainingShares, res.remainingEth, calculateTradeIDs, cbStatus, cbFill, cb);
		}
		return cb(null, res);
	}
}
