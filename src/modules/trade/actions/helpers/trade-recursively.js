import { augur, abi } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';

// if buying numShares must be 0, if selling totalEthWithFee must be 0
export function tradeRecursively(marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cbStatus, cbFill, cb) {
	const res = {
		remainingEth: totalEthWithFee,
		remainingShares: numShares,
		filledShares: 0,
		filledEth: 0,
		gasFees: ZERO
	};
	const matchingIDs = getTradeIDs();
	if (!matchingIDs.length) return cb(null, res);
	augur.trade({
		max_value: totalEthWithFee,
		max_amount: numShares,
		trade_ids: matchingIDs,
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
		onCommitFailed: (err) => cb,
		onNextBlock: (data) => console.log('trade-onNextBlock', data),
		onTradeSent: (data) => {
			console.debug('trade sent:', data);
			cbStatus({ status: 'filling' });
		},
		onTradeSuccess: (data) => {
			res.remainingEth = abi.number(data.unmatchedCash) || 0;
			res.remainingShares = abi.number(data.unmatchedShares) || 0;
			res.filledShares = abi.number(data.sharesBought) || 0;
			res.filledEth = abi.number(data.cashFromTrade) || 0;
			res.tradingFees = abi.number(data.tradingFees) || 0;
			res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
			res.timestamp = data.timestamp;
			res.hash = data.hash;
			console.debug('trade success:', data, res);
			if ((res.filledEth && res.remainingEth) || (res.filledShares && res.remainingShares)) {
				cbFill(res);
				return tradeRecursively(marketID, outcomeID, res.remainingShares, res.remainingEth, takerAddress, getTradeIDs, cbStatus, cbFill, cb);
			}
			return cb(null, res);
		},
		onTradeFailed: (err) => cb
	});
}
