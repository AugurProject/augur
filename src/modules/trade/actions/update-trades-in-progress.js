import BigNumber from 'bignumber.js';
import { augur, abi, constants } from '../../../services/augurjs';
import { BUY } from '../../trade/constants/types';
import { ZERO, TWO } from '../../trade/constants/numbers';
import { SCALAR } from '../../markets/constants/market-types';

import { selectAggregateOrderBook, selectTopBid, selectTopAsk } from '../../bids-asks/helpers/select-order-book';
import { selectMarket } from '../../market/selectors/market';

export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

// Updates user's trade. Only defined (i.e. !== undefined) parameters are updated
export function updateTradesInProgress(marketID, outcomeID, side, numShares, limitPrice, maxCost) {
	return (dispatch, getState) => {
		const { tradesInProgress, marketsData, loginAccount, orderBooks, orderCancellation } = getState();
		const outcomeTradeInProgress = tradesInProgress && tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID] || {};
		const market = marketsData[marketID];
		console.log('tradesInProgress IN:', side, numShares, limitPrice, maxCost);
		// if nothing changed, exit
		if (!market || (outcomeTradeInProgress.numShares === numShares && outcomeTradeInProgress.limitPrice === limitPrice && outcomeTradeInProgress.side === side && outcomeTradeInProgress.totalCost === maxCost)) {
			return;
		}
		// If either field is cleared, reset outcomeTradeInProgress while preserving the companion field's value
		if (numShares === '' && typeof limitPrice === 'undefined') {
			return dispatch({
				type: UPDATE_TRADE_IN_PROGRESS, data: {
					marketID,
					outcomeID,
					details: {
						limitPrice: outcomeTradeInProgress.limitPrice
					}
				}
			});
		} else if (limitPrice === '' || (parseFloat(limitPrice) === 0 && market.type !== SCALAR) && typeof numShares === 'undefined') {
			return dispatch({
				type: UPDATE_TRADE_IN_PROGRESS, data: {
					marketID,
					outcomeID,
					details: {
						numShares: outcomeTradeInProgress.numShares,
					}
				}
			});
		}

		// if new side not provided, use old side
		const cleanSide = side || outcomeTradeInProgress.side;

		// find top order to default limit price to
		const marketOrderBook = selectAggregateOrderBook(outcomeID, orderBooks[marketID], orderCancellation);
		const defaultPrice = market.type === SCALAR ?
			abi.bignum(market.maxValue)
				.plus(abi.bignum(market.minValue))
				.dividedBy(TWO)
				.toNumber() :
			0.5;
		const topOrderPrice = cleanSide === BUY ?
			((selectTopAsk(marketOrderBook, true) || {}).price || {}).formattedValue || defaultPrice :
			((selectTopBid(marketOrderBook, true) || {}).price || {}).formattedValue || defaultPrice;

		const bignumShares = abi.bignum(numShares);
		const bignumLimit = abi.bignum(limitPrice);
		// clean num shares
		const cleanNumShares = numShares && bignumShares.toFixed() === 0 ? 0 : numShares && bignumShares.abs().toFixed() || outcomeTradeInProgress.numShares || 0;

		// if shares exist, but no limit price, use top order
		let cleanLimitPrice = limitPrice && bignumLimit.toFixed() === 0 ? 0 : limitPrice && bignumLimit.toFixed() || outcomeTradeInProgress.limitPrice;

		if (cleanNumShares && !cleanLimitPrice && cleanLimitPrice !== 0) {
			cleanLimitPrice = topOrderPrice;
		}
		// if this isn't a scalar market, limitPrice must be positive.
		if (market.type !== SCALAR && limitPrice) {
			cleanLimitPrice = bignumLimit.abs().toFixed() || outcomeTradeInProgress.limitPrice || topOrderPrice;
		}

		const newTradeDetails = {
			side: cleanSide,
			numShares: cleanNumShares === '0' ? undefined : cleanNumShares,
			limitPrice: cleanLimitPrice,
			totalFee: 0,
			totalCost: 0
		};

		// trade actions
		if (newTradeDetails.side && newTradeDetails.numShares && loginAccount.id) {
			const market = selectMarket(marketID);
			augur.getParticipantSharesPurchased(marketID, loginAccount.id, outcomeID, (sharesPurchased) => {
				if (!sharesPurchased || sharesPurchased.error) {
					console.error('getParticipantSharesPurchased:', sharesPurchased);
					return dispatch({
						type: UPDATE_TRADE_IN_PROGRESS, data: {
							marketID,
							outcomeID,
							details: newTradeDetails
						}
					});
				}
				const position = abi.bignum(sharesPurchased).round(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
				newTradeDetails.tradeActions = augur.getTradingActions(
					newTradeDetails.side,
					newTradeDetails.numShares,
					newTradeDetails.limitPrice,
					market && market.takerFee || 0,
					market && market.makerFee || 0,
					loginAccount.id,
					position && position.toFixed(),
					outcomeID,
					market.cumulativeScale,
					orderBooks && orderBooks[marketID] || {},
					(market.type === SCALAR) ? {
						minValue: market.minValue,
						maxValue: market.maxValue
					} : null);
				if (newTradeDetails.tradeActions) {
					const numTradeActions = newTradeDetails.tradeActions.length;
					if (numTradeActions) {
						let totalCost = ZERO;
						let tradingFeesEth = ZERO;
						let gasFeesRealEth = ZERO;
						for (let i = 0; i < numTradeActions; ++i) {
							totalCost = totalCost.plus(abi.bignum(newTradeDetails.tradeActions[i].costEth));
							tradingFeesEth = tradingFeesEth.plus(abi.bignum(newTradeDetails.tradeActions[i].feeEth));
							gasFeesRealEth = gasFeesRealEth.plus(abi.bignum(newTradeDetails.tradeActions[i].gasEth));
						}
						newTradeDetails.totalCost = totalCost.toFixed();
						newTradeDetails.tradingFeesEth = tradingFeesEth.toFixed();
						newTradeDetails.gasFeesRealEth = gasFeesRealEth.toFixed();
						newTradeDetails.totalFee = tradingFeesEth.toFixed();
						if (newTradeDetails.side === 'sell') {
							newTradeDetails.feePercent = tradingFeesEth.dividedBy(totalCost.minus(tradingFeesEth))
								.times(100).abs()
								.toFixed();
						} else {
							newTradeDetails.feePercent = tradingFeesEth.dividedBy(totalCost.plus(tradingFeesEth))
								.times(100)
								.toFixed();
						}
					}
				}
				console.debug('newTradeDetails:', JSON.stringify(newTradeDetails, null, 2));
				dispatch({
					type: UPDATE_TRADE_IN_PROGRESS, data: {
						marketID,
						outcomeID,
						details: newTradeDetails
					}
				});
			});
		} else {
			dispatch({
				type: UPDATE_TRADE_IN_PROGRESS, data: {
					marketID,
					outcomeID,
					details: newTradeDetails
				}
			});
		}
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
