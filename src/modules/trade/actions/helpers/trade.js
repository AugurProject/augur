import async from 'async';
import { augur, abi } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';
import { SUCCESS } from '../../../transactions/constants/statuses';

// if buying numShares must be 0, if selling totalEthWithFee must be 0
export function trade(marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cbStatus, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares,
		filledShares: ZERO,
		filledEth: ZERO,
		gasFees: ZERO
	};
	const matchingIDs = getTradeIDs();
	console.log('matching trade IDs:', matchingIDs);
	const numTradeIDs = matchingIDs.length;
	if (!numTradeIDs) return cb(null, res);
	const chunkedIDs = [];
	for (let i = 0; i < numTradeIDs; i += 5) {
		chunkedIDs.push(matchingIDs.slice(i, i + 5));
	}
	console.log('chunked trade IDs:', chunkedIDs);
	console.info('iterating...');
	async.eachSeries(chunkedIDs, (chunk, nextChunk) => {
		console.debug('chunk:', chunk);
		console.debug('max_value (remainingEth):', res.remainingEth);
		console.debug('max_amount (remainingShares):', res.remainingShares);
		augur.trade({
			max_value: res.remainingEth,
			max_amount: res.remainingShares,
			trade_ids: chunk,
			sender: takerAddress,
			onTradeHash: (data) => cbStatus({ status: 'submitting' }),
			onCommitSent: (data) => cbStatus({ status: 'committing' }),
			onCommitSuccess: (data) => {
				res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
				cbStatus({
					status: 'sending',
					hash: data.hash,
					timestamp: data.timestamp,
					gasFees: res.gasFees
				});
			},
			onCommitFailed: (err) => nextChunk,
			onNextBlock: (data) => console.log('trade-onNextBlock', data),
			onTradeSent: (data) => {
				console.debug('trade sent:', data);
				cbStatus({ status: 'filling' });
			},
			onTradeSuccess: (data) => {
				console.debug('trade success:', data);
				res.remainingShares = abi.bignum(data.unmatchedShares);
				res.filledShares = res.filledShares.plus(abi.bignum(data.sharesBought));
				res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
				res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
				res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
				console.debug('res:', JSON.stringify(res, null, 2));
				cbStatus({
					status: SUCCESS,
					hash: data.hash,
					timestamp: data.timestamp,
					tradingFees: res.tradingFees,
					gasFees: res.gasFees
				});
				if ((res.filledShares.gt(ZERO) && res.remainingEth.gt(ZERO)) || (res.filledEth.gt(ZERO) && res.remainingShares.gt(ZERO))) {
					return nextChunk();
				}
				nextChunk({ isComplete: true });
			},
			onTradeFailed: (err) => nextChunk
		});
	}, (err) => {
		if (err && !err.isComplete) return cb(err);
		console.log('trade success:', res);
		cb(null, res);
	});
}
