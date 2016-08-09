import { augur } from '../../../../services/augurjs';

export function tradeRecursively(marketID, outcomeID, numShares, totalEthWithFee, calculateTradeIDs, cbStatus, cbFill, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares,
		filledShares: 0,
		filledEth: 0
	};

	const matchingIDs = calculateTradeIDs();
	console.log('* trade inputs:', 'marketID', marketID, 'outcomeID', outcomeID, 'numShares', numShares, 'totalEthWithFee', totalEthWithFee, 'matchingIDs', matchingIDs);
	if (!matchingIDs.length) {
		return cb(null, res);
	}

	augur.trade({
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
		res.filledShares = parseFloat(data.sharesBought) || 0;
		res.filledEth = parseFloat(data.cashFromTrade) || 0;

		console.log('* trade success data:', data);
		if ((res.filledEth && res.remainingEth) || (res.filledShares && res.remainingShares)) {
			cbFill(res);
			return tradeRecursively(marketID, outcomeID, res.remainingShares, res.remainingEth, calculateTradeIDs, cbStatus, cbFill, cb);
		}
		return cb(null, res);
	}
}
