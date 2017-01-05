import async from 'async';
import BigNumber from 'bignumber.js';
import { BUY, SELL } from '../../trade/constants/types';
import { SCALAR } from '../../markets/constants/market-types';
import { augur, abi, constants } from '../../../services/augurjs';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commit-lock';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';
import { trade } from '../../trade/actions/helpers/trade';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';

export function selectScalarMinimum(marketID) {
	return (dispatch, getState) => {
		const market = getState().marketsData[marketID];
		const scalarMinimum = {};
		if (market && market.type === SCALAR) scalarMinimum.minValue = market.minValue;
		return scalarMinimum;
	};
}

export function parametrizeOrder(marketID, outcomeID, numShares, limitPrice) {
	return (dispatch, getState) => ({
		amount: numShares,
		price: limitPrice,
		market: marketID,
		outcome: outcomeID,
		scalarMinMax: dispatch(selectScalarMinimum(marketID))
	});
}

export function placeBid(marketID, outcomeID, numShares, limitPrice) {
	return (dispatch, getState) => {
		augur.buy({
			...parametrizeOrder(marketID, outcomeID, numShares, limitPrice),
			onSent: res => console.log('bid sent:', res),
			onSuccess: res => console.log('bid success:', res),
			onFailed: err => console.error('bid failed:', err)
		});
	};
}

export function placeAsk(marketID, outcomeID, numShares, limitPrice) {
	return (dispatch, getState) => {
		augur.sell({
			...parametrizeOrder(marketID, outcomeID, numShares, limitPrice),
			onSent: res => console.log('ask sent:', res),
			onSuccess: res => console.log('ask success:', res),
			onFailed: err => console.error('ask failed:', err)
		});
	};
}

export function placeShortAsk(marketID, outcomeID, numShares, limitPrice) {
	return (dispatch, getState) => {
		augur.shortAsk({
			...parametrizeOrder(marketID, outcomeID, numShares, limitPrice),
			onSent: res => console.log('shortAsk sent:', res),
			onSuccess: res => console.log('shortAsk success:', res),
			onFailed: err => console.error('shortAsk failed:', err)
		});
	};
}

export function placeBuy(marketID, outcomeID, numShares, limitPrice, totalCost) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const getTradeIDs = () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		trade(marketID, outcomeID, 0, totalCost, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('trade failed:', err);
			console.debug('trade complete:', res);
			const sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
			if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
				console.debug('buy remainder:', sharesRemaining.toFixed(), 'shares remaining,', res.remainingEth.toFixed(), 'cash remaining', constants.PRECISION.limit.toFixed(), 'precision limit');
				dispatch(placeBid(marketID, outcomeID, sharesRemaining.toFixed(), limitPrice));
			}
		});
	};
}

export function placeSell(marketID, outcomeID, numShares, limitPrice, totalCost) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const getTradeIDs = () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		trade(marketID, outcomeID, numShares, 0, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('trade failed:', err);
			console.debug('trade complete:', res);
			if (res.remainingShares.gt(constants.PRECISION.zero)) {
				augur.getParticipantSharesPurchased(marketID, loginAccount.address, outcomeID, (sharesPurchased) => {
					const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
					const remainingShares = abi.bignum(res.remainingShares);
					if (position.gt(constants.PRECISION.zero)) {
						let askShares;
						let shortAskShares;
						if (position.gt(remainingShares)) {
							askShares = remainingShares.round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
							shortAskShares = 0;
						} else {
							askShares = position.toFixed();
							shortAskShares = remainingShares.minus(position).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN).toFixed();
						}
						dispatch(placeAsk(marketID, outcomeID, askShares, limitPrice));
						if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
							dispatch(placeShortAsk(marketID, outcomeID, shortAskShares, limitPrice));
						}
					} else {
						dispatch(loadBidsAsks(marketID, (err, updatedOrderBook) => {
							if (err) console.error('loadBidsAsks:', err);
							const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, { [marketID]: updatedOrderBook }, loginAccount.address);
							if (tradeIDs && tradeIDs.length) {
								dispatch(placeShortSell(marketID, outcomeID, res.remainingShares, limitPrice, totalCost));
							} else {
								dispatch(placeShortAsk(marketID, outcomeID, res.remainingShares, limitPrice));
							}
						}));
					}
				});
			}
		});
	};
}

// note: placeholder
export function placeShortSell(marketID, outcomeID, numShares, limitPrice, totalCost) {
	return (dispatch, getState) => {
		const { marketsData, outcomesData } = getState();
		const market = marketsData[marketID];
		dispatch(updateTradeCommitLock(true));
		dispatch(addShortSellTransaction(marketID, outcomeID, market.type, market.description, outcomesData[marketID][outcomeID].name, numShares, limitPrice, totalCost, 0, 0, 0));
	};
}

export function placeTrade(marketID, outcomeID) {
	return (dispatch, getState) => {
		const { loginAccount, marketsData, orderBooks, tradesInProgress } = getState();
		const market = marketsData[marketID];
		if (!tradesInProgress[marketID] || !market) {
			return console.error(`trade-in-progress not found for ${marketID} ${outcomeID}`);
		}
		async.eachSeries(tradesInProgress[marketID], (tradeInProgress, nextTradeInProgress) => {
			if (!tradeInProgress.limitPrice || !tradeInProgress.numShares || !tradeInProgress.totalCost) {
				return nextTradeInProgress();
			}
			console.debug('tradeInProgress:', tradeInProgress);
			const totalCost = abi.bignum(tradeInProgress.totalCost).abs().toFixed();
			const limitPrice = tradeInProgress.limitPrice;
			const numShares = tradeInProgress.numShares;
			if (tradeInProgress.side === BUY) {
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
				if (tradeIDs && tradeIDs.length) {
					dispatch(placeBuy(marketID, outcomeID, numShares, limitPrice, totalCost));
				} else {
					dispatch(placeBid(marketID, outcomeID, numShares, limitPrice));
				}
				nextTradeInProgress();
			} else if (tradeInProgress.side === SELL) {

				// check if user has position
				//  - if so, sell/ask
				//  - if not, short sell/short ask
				augur.getParticipantSharesPurchased(marketID, loginAccount.address, outcomeID, (sharesPurchased) => {
					if (!sharesPurchased || sharesPurchased.error) {
						return nextTradeInProgress('getParticipantSharesPurchased:', sharesPurchased);
					}
					const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
					const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
					if (position && position.gt(constants.PRECISION.zero)) {
						if (tradeIDs && tradeIDs.length) {
							dispatch(placeSell(marketID, outcomeID, numShares, limitPrice, totalCost));
						} else {
							let askShares;
							let shortAskShares;
							const bnNumShares = abi.bignum(numShares);
							if (position.gt(bnNumShares)) {
								askShares = numShares;
								shortAskShares = '0';
							} else {
								askShares = position.toFixed();
								shortAskShares = bnNumShares.minus(position).toFixed();
							}
							dispatch(placeAsk(marketID, outcomeID, askShares, limitPrice));
							if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
								dispatch(placeShortAsk(marketID, outcomeID, shortAskShares, limitPrice));
							}
						}
					} else if (tradeIDs && tradeIDs.length) {
						dispatch(placeShortSell(marketID, outcomeID, numShares, limitPrice, totalCost));
					} else {
						dispatch(placeShortAsk(marketID, outcomeID, numShares, limitPrice));
					}
					nextTradeInProgress();
				});
			}
		}, (err) => {
			if (err) console.error('place trade:', err);
			dispatch(clearTradeInProgress(marketID));
		});
	};
}
