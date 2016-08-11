import { augur } from '../../../services/augurjs';
import { BUY } from '../../trade/constants/types';
import { selectAggregateOrderBook, selectTopBid, selectTopAsk } from '../../bids-asks/selectors/select-order-book';

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
		const topOrderPrice = cleanSide === BUY ?
			((selectTopAsk(marketOrderBook) || {}).price || {}).formattedValue || 1 :
			((selectTopBid(marketOrderBook) || {}).price || {}).formattedValue || 0;

		// clean num shares
		const cleanNumShares = Math.abs(parseFloat(numShares)) || outcomeTradeInProgress.numShares || 0;
		// const cleanMaxCost = Math.abs(parseFloat(maxCost));

		// if shares exist, but no limit price, use top order
		let cleanLimitPrice = Math.abs(parseFloat(limitPrice)) || outcomeTradeInProgress.limitPrice;
		if (cleanNumShares && !cleanLimitPrice && cleanLimitPrice !== 0) {
			cleanLimitPrice = topOrderPrice;
		}

		// calculate totals
		const negater = cleanSide === BUY ? -1 : 1;
		const costEth = cleanNumShares * cleanLimitPrice;
		const feeEth = market.takerFee * costEth;
		const totalCost = (costEth * negater) - feeEth;

		const newTradeDetails = {
			side: cleanSide,
			numShares: cleanNumShares || undefined,
			limitPrice: cleanLimitPrice || undefined,
			totalFee: feeEth,
			totalCost
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
				orderBooks && orderBooks[marketID] || {});
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
