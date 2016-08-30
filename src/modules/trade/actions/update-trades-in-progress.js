import { augur, abi } from '../../../services/augurjs';
import { BUY } from '../../trade/constants/types';
import { ZERO, TWO } from '../../trade/constants/numbers';
import { SCALAR } from '../../markets/constants/market-types';

import { selectAggregateOrderBook, selectTopBid, selectTopAsk } from '../../bids-asks/helpers/select-order-book';

export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

// Updates user's trade. Only defined (i.e. !== undefined) parameters are updated
export function updateTradesInProgress(marketID, outcomeID, side, numShares, limitPrice, maxCost) {
	return (dispatch, getState) => {
		const { tradesInProgress, marketsData, loginAccount, accountTrades, orderBooks, orderCancellation } = getState();
		const outcomeTradeInProgress = tradesInProgress && tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID] || {};
		const market = marketsData[marketID];

		// if nothing changed, exit
		if (!market || (outcomeTradeInProgress.numShares === numShares && outcomeTradeInProgress.limitPrice === limitPrice && outcomeTradeInProgress.side === side && outcomeTradeInProgress.totalCost === maxCost)) {
			return;
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
			((selectTopAsk(marketOrderBook) || {}).price || {}).formattedValue || defaultPrice :
			((selectTopBid(marketOrderBook) || {}).price || {}).formattedValue || defaultPrice;

		// clean num shares
		const cleanNumShares = Math.abs(parseFloat(numShares)) || outcomeTradeInProgress.numShares || 0;
		// const cleanMaxCost = Math.abs(parseFloat(maxCost));

		// if shares exist, but no limit price, use top order
		let cleanLimitPrice = Math.abs(parseFloat(limitPrice)) || outcomeTradeInProgress.limitPrice;
		if (cleanNumShares && !cleanLimitPrice && cleanLimitPrice !== 0) {
			cleanLimitPrice = topOrderPrice;
		}

		// calculate totals
		let costEth;
		let feeEth;
		if (cleanLimitPrice !== undefined) {
			costEth = abi.bignum(cleanNumShares).times(abi.bignum(cleanLimitPrice));
			feeEth = abi.bignum(market.takerFee).times(costEth);
			feeEth = feeEth.toFixed();
		} else {
			costEth = NaN;
			feeEth = NaN;
		}

		const newTradeDetails = {
			side: cleanSide,
			numShares: cleanNumShares || undefined,
			limitPrice: cleanLimitPrice || undefined,
			totalFee: feeEth,
			totalCost: 0
		};

		// trade actions
		if (newTradeDetails.side && newTradeDetails.numShares && loginAccount.id) {
			newTradeDetails.tradeActions = augur.getTradingActions(
				newTradeDetails.side,
				newTradeDetails.numShares,
				newTradeDetails.limitPrice,
				market && market.takerFee || 0,
				market && market.makerFee || 0,
				loginAccount.id,
				accountTrades && accountTrades[marketID] && accountTrades[marketID][outcomeID] && accountTrades[marketID][outcomeID].qtyShares || 0,
				outcomeID,
				market.cumulativeScale,
				orderBooks && orderBooks[marketID] || {});
			if (newTradeDetails.tradeActions) {
				const numTradeActions = newTradeDetails.tradeActions.length;
				if (numTradeActions) {
					let totalCost = ZERO;
					for (let i = 0; i < numTradeActions; ++i) {
						totalCost = totalCost.plus(abi.bignum(newTradeDetails.tradeActions[i].costEth));
					}
					newTradeDetails.totalCost = totalCost.toFixed();
				}
			}
			console.log('newTradeDetails:', newTradeDetails);
		}

		dispatch({
			type: UPDATE_TRADE_IN_PROGRESS, data: {
				marketID,
				outcomeID,
				details: newTradeDetails
			}
		});
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
