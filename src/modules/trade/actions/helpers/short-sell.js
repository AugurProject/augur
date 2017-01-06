import async from 'async';
import { augur, abi, constants } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';
import { updateTradeCommitment } from '../../../trade/actions/update-trade-commitment';
import selectOrder from '../../../bids-asks/selectors/select-order';

export function shortSell(marketID, outcomeID, numShares, tradingFees, takerAddress, getTradeIDs, dispatch, cbStatus, cb) {
	const res = {
		remainingShares: abi.bignum(numShares) || ZERO,
		filledShares: ZERO,
		filledEth: ZERO,
		tradingFees: ZERO,
		gasFees: ZERO
	};
	const matchingIDs = getTradeIDs();
	console.log('matching trade IDs:', matchingIDs);
	if (!matchingIDs.length || res.remainingShares.lte(ZERO)) return cb(null, res);
	async.eachSeries(matchingIDs, (matchingID, nextMatchingID) => {
		const maxAmount = res.remainingShares.toFixed();
		augur.short_sell({
			max_amount: maxAmount,
			buyer_trade_id: matchingID,
			sender: takerAddress,
			onTradeHash: tradeHash => dispatch(updateTradeCommitment({
				tradeHash: abi.format_int256(tradeHash),
				orders: [selectOrder(matchingID)],
				maxValue: '0',
				maxAmount,
				remainingEth: '0',
				remainingShares: res.remainingShares.toFixed(),
				filledEth: res.filledEth.toFixed(),
				filledShares: res.filledShares.toFixed(),
				tradingFees: res.tradingFees.gt(ZERO) ? res.tradingFees.toFixed() : tradingFees,
				gasFees: res.gasFees.toFixed()
			})),
			onCommitSent: data => cbStatus({ status: 'committing' }),
			onCommitSuccess: (data) => {
				res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
				dispatch(updateTradeCommitment({ gasFees: res.gasFees.toFixed() }));
			},
			onCommitFailed: (err) => {
				console.log('commit failed:', err);
				nextMatchingID(err);
			},
			onNextBlock: data => console.log('short_sell-onNextBlock', data),
			onTradeSent: data => console.debug('trade sent', data),
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
				dispatch(updateTradeCommitment({
					filledShares: res.filledShares.toFixed(),
					filledEth: res.filledEth.toFixed(),
					remainingShares: res.remainingShares.toFixed(),
					tradingFees: res.tradingFees.toFixed(),
					gasFees: res.gasFees.toFixed()
				}));
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
