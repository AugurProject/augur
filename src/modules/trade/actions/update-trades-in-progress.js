export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

/**
 * Updates user's trade. Only defined (i.e. !== undefined) parameters are updated
 *
 * @param {String} marketID
 * @param {String} outcomeID
 * @param {Number=} numShares
 * @param {Number=} limitPrice
 * @param {String=} side
 * @return {function()}
 */
export function updateTradesInProgress(marketID, outcomeID, numShares, limitPrice, side) {
	return (dispatch, getState) => {
		const tradesInProgress = getState().tradesInProgress;

		let currentTrade;
		if (tradesInProgress[marketID] != null && tradesInProgress[marketID][outcomeID] != null) {
			currentTrade = tradesInProgress[marketID][outcomeID];
		} else {
			currentTrade = {};
		}

		if (currentTrade.numShares === numShares &&
			currentTrade.limitPrice === limitPrice &&
			currentTrade.side === side) {
			return;
		}

		const newTradeDetails = {
			numShares: numShares !== undefined ? numShares : currentTrade.numShares,
			limitPrice: limitPrice !== undefined ? limitPrice : currentTrade.limitPrice,
			side: side !== undefined ? side : currentTrade.side
		};
		newTradeDetails.totalCost = (newTradeDetails.numShares != null && newTradeDetails.limitPrice != null)
			? newTradeDetails.numShares * newTradeDetails.limitPrice
			: null;

		dispatch({
			type: UPDATE_TRADE_IN_PROGRESS, data: {
				marketID,
				outcomeID,
				details: newTradeDetails			}
		});
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
