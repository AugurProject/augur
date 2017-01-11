import BigNumber from 'bignumber.js';
import { augur, abi, constants } from '../../../services/augurjs';
import { updateTradeCommitLock } from '../../trade/actions/update-trade-commitment';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { trade } from '../../trade/actions/helpers/trade';
import { shortSell } from '../../trade/actions/helpers/short-sell';
import { loadBidsAsks } from '../../bids-asks/actions/load-bids-asks';
import { placeAsk, placeBid, placeShortAsk } from '../../trade/actions/make-order';

export function placeBuy(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const marketID = market.id;
		const getTradeIDs = () => calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		trade(marketID, outcomeID, 0, totalCost, tradingFees, tradeGroupID, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('trade failed:', err);
			const sharesRemaining = abi.bignum(numShares).minus(res.filledShares);
			if (sharesRemaining.gte(constants.PRECISION.limit) && res.remainingEth.gte(constants.PRECISION.limit)) {
				console.debug('buy remainder:', sharesRemaining.toFixed(), 'shares remaining,', res.remainingEth.toFixed(), 'cash remaining', constants.PRECISION.limit.toFixed(), 'precision limit');
				placeBid(market, outcomeID, sharesRemaining.toFixed(), limitPrice, tradeGroupID);
			}
		});
	};
}

export function placeSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const marketID = market.id;
		const getTradeIDs = () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		trade(marketID, outcomeID, numShares, 0, tradingFees, tradeGroupID, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
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
						placeAsk(market, outcomeID, askShares, limitPrice, tradeGroupID);
						if (abi.bignum(shortAskShares).gt(constants.PRECISION.zero)) {
							placeShortAsk(market, outcomeID, shortAskShares, limitPrice, tradeGroupID);
						}
					} else {
						dispatch(loadBidsAsks(marketID, (err, updatedOrderBook) => {
							if (err) console.error('loadBidsAsks:', err);
							const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, limitPrice, { [marketID]: updatedOrderBook }, loginAccount.address);
							if (tradeIDs && tradeIDs.length) {
								dispatch(placeShortSell(market, outcomeID, res.remainingShares, limitPrice, totalCost, tradingFees, tradeGroupID));
							} else {
								placeShortAsk(market, outcomeID, res.remainingShares, limitPrice, tradeGroupID);
							}
						}));
					}
				});
			}
		});
	};
}

export function placeShortSell(market, outcomeID, numShares, limitPrice, totalCost, tradingFees, tradeGroupID) {
	return (dispatch, getState) => {
		const { loginAccount, orderBooks } = getState();
		dispatch(updateTradeCommitLock(true));
		const marketID = market.id;
		const getTradeIDs = () => calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, loginAccount.address);
		shortSell(marketID, outcomeID, numShares, tradingFees, tradeGroupID, loginAccount.address, getTradeIDs, dispatch, r => console.debug('cbStatus:', r), (err, res) => {
			dispatch(updateTradeCommitLock(false));
			if (err) return console.error('shortSell failed:', err);
			if (res.remainingShares.gt(constants.PRECISION.zero)) {
				placeShortAsk(market, outcomeID, res.remainingShares.toFixed(), limitPrice, tradeGroupID);
			}
		});
	};
}
