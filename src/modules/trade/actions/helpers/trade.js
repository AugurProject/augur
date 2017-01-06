import BigNumber from 'bignumber.js';
import async from 'async';
import { augur, abi, constants } from '../../../../services/augurjs';
import { ZERO } from '../../../trade/constants/numbers';
import { loadBidsAsks } from '../../../bids-asks/actions/load-bids-asks';
import { updateTradeCommitment } from '../../../trade/actions/update-trade-commitment';
import selectOrder from '../../../bids-asks/selectors/select-order';

// if buying numShares must be 0, if selling totalEthWithFee must be 0
export function trade(marketID, outcomeID, numShares, totalEthWithFee, tradingFees, takerAddress, getTradeIDs, dispatch, cbStatus, cb) {
	// undefined/null arguments get zero'ed out to gracefully fail
	const bnTotalEth = abi.bignum(totalEthWithFee) || ZERO;
	const bnNumShares = abi.bignum(numShares) || ZERO;
	const res = {
		remainingEth: bnTotalEth,
		remainingShares: bnNumShares,
		filledShares: ZERO,
		filledEth: ZERO,
		tradingFees: ZERO,
		gasFees: ZERO
	};
	let matchingTradeIDs;
	let bnSharesPurchased = bnNumShares;
	let bnCashBalance = bnTotalEth;
	async.until(() => {
		matchingTradeIDs = getTradeIDs();
		// console.log('matchingTradeIDs:', matchingTradeIDs);
		console.log('remainingEth:', res.remainingEth.toFixed());
		console.log('remainingShares:', res.remainingShares.toFixed());
		console.log('sharesPurchased:', bnSharesPurchased.toFixed());
		console.log('balance:', bnCashBalance.toFixed());
		return !matchingTradeIDs.length ||
			(res.remainingEth.lte(constants.PRECISION.zero) && res.remainingShares.lte(constants.PRECISION.zero)) ||
			(bnNumShares.gt(constants.ZERO) && bnSharesPurchased.lte(constants.PRECISION.zero)) ||
			(bnTotalEth.gt(constants.ZERO) && bnCashBalance.lte(constants.PRECISION.zero));
	}, (nextTrade) => {
		let tradeIDs = matchingTradeIDs;
		tradeIDs = tradeIDs.slice(0, 3);
		augur.getParticipantSharesPurchased(marketID, takerAddress, outcomeID, (sharesPurchased) => {
			bnSharesPurchased = abi.bignum(sharesPurchased);
			augur.getCashBalance(takerAddress, (cashBalance) => {
				bnCashBalance = abi.bignum(cashBalance);
				let isRemainder;
				let maxAmount;
				if (res.remainingShares.gt(bnSharesPurchased)) {
					maxAmount = bnSharesPurchased;
					isRemainder = true;
				} else {
					maxAmount = res.remainingShares;
					isRemainder = false;
				}
				const maxValue = BigNumber.min(res.remainingEth, bnCashBalance);
				augur.trade({
					max_value: maxValue.toFixed(),
					max_amount: maxAmount.toFixed(),
					trade_ids: tradeIDs,
					sender: takerAddress,
					onTradeHash: tradeHash => dispatch(updateTradeCommitment({
						tradeHash: abi.format_int256(tradeHash),
						orders: tradeIDs.map(tradeID => selectOrder(tradeID)),
						maxValue: maxValue.toFixed(),
						maxAmount: maxAmount.toFixed(),
						remainingEth: res.remainingEth.toFixed(),
						remainingShares: res.remainingShares.toFixed(),
						filledEth: res.filledEth.toFixed(),
						filledShares: res.filledShares.toFixed(),
						tradingFees: res.tradingFees.gt(ZERO) ? res.tradingFees.toFixed() : tradingFees,
						gasFees: res.gasFees.toFixed()
					})),
					onCommitSent: data => console.log('commit sent:', data),
					onCommitSuccess: (data) => {
						res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
						dispatch(updateTradeCommitment({ gasFees: res.gasFees.toFixed() }));
					},
					onCommitFailed: (err) => {
						console.log('commit failed:', err);
						nextTrade(err);
					},
					onNextBlock: data => console.log('trade-onNextBlock', data),
					onTradeSent: data => console.log('trade sent:', data),
					onTradeSuccess: (data) => {
						console.log('trade success:', data);
						res.filledShares = res.filledShares.plus(abi.bignum(data.sharesBought));
						res.filledEth = res.filledEth.plus(abi.bignum(data.cashFromTrade));
						if (isRemainder) {
							res.remainingShares = res.remainingShares.minus(maxAmount).plus(abi.bignum(data.unmatchedShares));
						} else {
							res.remainingShares = abi.bignum(data.unmatchedShares);
						}
						res.remainingEth = abi.bignum(data.unmatchedCash);
						res.tradingFees = res.tradingFees.plus(abi.bignum(data.tradingFees));
						res.gasFees = res.gasFees.plus(abi.bignum(data.gasFees));
						dispatch(updateTradeCommitment({
							filledShares: res.filledShares.toFixed(),
							filledEth: res.filledEth.toFixed(),
							remainingShares: res.remainingShares.toFixed(),
							remainingEth: res.remainingEth.toFixed(),
							tradingFees: res.tradingFees.toFixed(),
							gasFees: res.gasFees.toFixed()
						}));
						dispatch(loadBidsAsks(marketID, () => {
							augur.getParticipantSharesPurchased(marketID, takerAddress, outcomeID, (sharesPurchased) => {
								bnSharesPurchased = abi.bignum(sharesPurchased);
								augur.getCashBalance(takerAddress, (cashBalance) => {
									bnCashBalance = abi.bignum(cashBalance);
									nextTrade();
								});
							});
						}));
					},
					onTradeFailed: (err) => {
						console.log('trade failed:', err);
						nextTrade(err);
					}
				});
			});
		});
	}, (err) => {
		if (err) return cb(err);
		console.log('full trade success:', JSON.stringify(res, null, 2));
		cb(null, res);
	});
}
