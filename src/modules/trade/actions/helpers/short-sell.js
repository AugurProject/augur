import async from 'async';
import { augur, abi, constants } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';
import { SUCCESS } from '../../../transactions/constants/statuses';

export function shortSell(marketID, outcomeID, numShares, takerAddress, getTradeIDs, cbStatus, cb) {
	const res = {
		remainingShares: abi.bignum(numShares) || ZERO,
		filledShares: ZERO,
		filledEth: ZERO,
		tradingFees: ZERO,
		gasFees: ZERO
	};
	const matchingIDs = getTradeIDs();
	console.log('matching trade IDs:', matchingIDs);
	if (!matchingIDs.length || res.remainingShares === ZERO) return cb(null, res);
	async.eachSeries(matchingIDs, (matchingID, nextMatchingID) => {
		augur.short_sell({
			max_amount: res.remainingShares.toFixed(),
			buyer_trade_id: matchingID,
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
			onCommitFailed: (err) => {
				console.log('commit failed:', err);
				nextMatchingID(err);
			},
			onNextBlock: (data) => console.log('short_sell-onNextBlock', data),
			onTradeSent: (data) => {
				console.debug('trade sent', data);
				cbStatus({ status: 'filling' });
			},
			onTradeSuccess: (data) => {
				if (data.unmatchedShares) {
					res.remainingShares = abi.bignum(data.unmatchedShares);
				} else {
					res.remainingShares = ZERO;
				}
				if (data.matchedShares) {
					res.filledShares = res.filledShares.plus(abi.bignum(data.matchedShares));
				}
				if (data.cashFromTrade) {
					res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
				}
				res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
				res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
				cbStatus({
					status: SUCCESS,
					hash: data.hash,
					timestamp: data.timestamp,
					tradingFees: res.tradingFees,
					gasFees: res.gasFees
				});
				if (res.remainingShares.gt(constants.PRECISION.zero)) return nextMatchingID();
				nextMatchingID({ isComplete: true });
			},
			onTradeFailed: (err) => {
				console.log('trade failed:', err);
				nextMatchingID(err);
			}
		});
	}, (err) => {
		if (err && !err.isComplete) return cb(err);
		console.log('short_sell success:', JSON.stringify(res, null, 2));
		cb(null, res);
	});
}
