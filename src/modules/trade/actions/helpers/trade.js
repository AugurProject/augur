import async from 'async';
import { augur, abi } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';

// if buying numShares must be 0, if selling totalEthWithFee must be 0
export function trade(marketID, outcomeID, numShares, totalEthWithFee, takerAddress, getTradeIDs, cbStatus, cb) {
	const bnTotalEth = abi.bignum(totalEthWithFee);
	const bnNumShares = abi.bignum(numShares);
	const res = {
		remainingEth: bnTotalEth,
		remainingShares: bnNumShares,
		filledShares: ZERO,
		filledEth: ZERO,
		tradingFees: ZERO,
		gasFees: ZERO
	};
	let matchingTradeIDs;
	async.until(() => {
		matchingTradeIDs = getTradeIDs();
		return !matchingTradeIDs.length || (res.remainingEth.eq(ZERO) && res.filledEth.eq(ZERO));
	}, (nextTrade) => {
		console.debug(JSON.stringify({
			max_value: res.remainingEth.toFixed(),
			max_amount: res.remainingShares.toFixed(),
			trade_ids: matchingTradeIDs.slice(0, 5)
		}), null, 2);
		augur.trade({
			max_value: res.remainingEth.toFixed(),
			max_amount: res.remainingShares.toFixed(),
			trade_ids: matchingTradeIDs.slice(0, 5),
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
			onCommitFailed: (err) => nextTrade,
			onNextBlock: (data) => console.log('trade-onNextBlock', data),
			onTradeSent: (data) => {
				console.log('trade sent:', data);
				cbStatus({ status: 'filling' });
			},
			onTradeSuccess: (data) => {
				console.log('trade success:', data);
				res.filledShares = res.filledShares.plus(abi.bignum(data.sharesBought));
				res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
				res.remainingShares = abi.bignum(data.unmatchedShares);
				res.remainingEth = abi.bignum(data.unmatchedCash);
				res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
				res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
				cbStatus({
					status: 'filled',
					hash: data.hash,
					timestamp: data.timestamp,
					tradingFees: res.tradingFees,
					gasFees: res.gasFees,
					filledShares: res.filledShares,
					filledEth: res.filledEth,
					remainingShares: res.remainingShares,
					remainingEth: res.remainingEth
				});
				nextTrade();
			},
			onTradeFailed: (err) => nextTrade
		});
	}, (err) => {
		if (err) return cb(err);
		console.log('full trade success:', JSON.stringify(res, null, 2));
		cb(null, res);
	});
}
