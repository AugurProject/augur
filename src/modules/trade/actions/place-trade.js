import async from 'async';
import BigNumber from 'bignumber.js';
import { BUY, SELL } from '../../trade/constants/types';
import { augur, abi, constants } from '../../../services/augurjs';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commitment';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { trade } from '../../trade/actions/helpers/trade';
import { shortSell } from '../../trade/actions/helpers/short-sell';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { placeAsk, placeBid, placeShortAsk } from '../../trade/actions/make-order';

export function placeBuy(market, outcomeID, numShares, limitPrice, totalCost, tradingFees) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const marketID = market.id;
		const getTradeIDs = () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		trade(marketID, outcomeID, 0, totalCost, tradingFees, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('trade failed:', err);
			const sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
			if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
				console.debug('buy remainder:', sharesRemaining.toFixed(), 'shares remaining,', res.remainingEth.toFixed(), 'cash remaining', constants.PRECISION.limit.toFixed(), 'precision limit');
				placeBid(market, outcomeID, sharesRemaining.toFixed(), limitPrice);
			}
		});
	};
}

export function placeSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const marketID = market.id;
		const getTradeIDs = () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		trade(marketID, outcomeID, numShares, 0, tradingFees, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('trade failed:', err);
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
						placeAsk(market, outcomeID, askShares, limitPrice);
						if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
							placeShortAsk(market, outcomeID, shortAskShares, limitPrice);
						}
					} else {
						dispatch(loadBidsAsks(marketID, (err, updatedOrderBook) => {
							if (err) console.error('loadBidsAsks:', err);
							const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, { [marketID]: updatedOrderBook }, loginAccount.address);
							if (tradeIDs && tradeIDs.length) {
								dispatch(placeShortSell(market, outcomeID, res.remainingShares, limitPrice, totalCost, tradingFees));
							} else {
								placeShortAsk(market, outcomeID, res.remainingShares, limitPrice);
							}
						}));
					}
				});
			}
		});
	};
}

export function placeShortSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const marketID = market.id;
		const getTradeIDs = () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		shortSell(marketID, outcomeID, numShares, tradingFees, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('shortSell failed:', err);
			if (res.remainingShares.gt(constants.PRECISION.zero)) {
				placeShortAsk(market, outcomeID, res.remainingShares.toFixed(), limitPrice);
			}
		});
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
			const tradingFees = tradeInProgress.tradingFeesEth;
			if (tradeInProgress.side === BUY) {
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
				if (tradeIDs && tradeIDs.length) {
					dispatch(placeBuy(market, outcomeID, numShares, limitPrice, totalCost, tradingFees));
				} else {
					placeBid(market, outcomeID, numShares, limitPrice);
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
							dispatch(placeSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees));
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
							placeAsk(market, outcomeID, askShares, limitPrice);
							if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
								placeShortAsk(market, outcomeID, shortAskShares, limitPrice);
							}
						}
					} else if (tradeIDs && tradeIDs.length) {
						dispatch(placeShortSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees));
					} else {
						placeShortAsk(market, outcomeID, numShares, limitPrice);
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
