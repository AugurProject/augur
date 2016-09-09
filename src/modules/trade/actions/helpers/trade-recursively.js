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

	augur.trade({
		max_value: totalEthWithFee,
		max_amount: numShares,
		trade_ids: matchingIDs,
		sender: takerAddress,

		onTradeHash: data => cbStatus({ status: 'submitting' }),

		onCommitSent: data => cbStatus({ status: 'committing' }),
		onCommitSuccess: data => cbStatus({ status: 'sending', hash: data.txHash, timestamp: data.timestamp }),
		onCommitFailed: err => cb,

		onNextBlock: data => console.log('trade-onNextBlock', data),

		onTradeSent: data => {
			console.log('!!!! onTradeSent', data);
			cbStatus({ status: 'filling' });
		},
		onTradeSuccess: doSuccess,
		onTradeFailed: err => cb
	});

	function doSuccess(data) {
		res.remainingEth = parseFloat(data.unmatchedCash) || 0;
		res.remainingShares = parseFloat(data.unmatchedShares) || 0;
		res.filledShares = parseFloat(data.sharesBought) || 0;
		res.filledEth = parseFloat(data.cashFromTrade) || 0;
		res.tradingFeesEth = parseFloat(data.tradingFees) || 0;
		res.gasFeesRealEth = parseFloat(data.gasFees) || 0;

		console.log('* trade success data:', data, res);
		if ((res.filledEth && res.remainingEth) || (res.filledShares && res.remainingShares)) {
			cbFill(res);
			return tradeRecursively(marketID, outcomeID, res.remainingShares, res.remainingEth, takerAddress, getTradeIDs, cbStatus, cbFill, cb);
		}
		return cb(null, res);
	}
}
