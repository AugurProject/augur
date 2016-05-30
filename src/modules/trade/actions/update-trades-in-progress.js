import * as AugurJS from '../../../services/augurjs';

export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

export function updateTradesInProgress(marketID, outcomeID, numShares, limitPrice) {
	return (dispatch, getState) => {
		const tradesInProgress = getState().tradesInProgress;

		if (tradesInProgress[marketID] &&
			tradesInProgress[marketID][outcomeID] &&
			tradesInProgress[marketID][outcomeID].numShares === numShares &&
			tradesInProgress[marketID][outcomeID].limitPrice === limitPrice) {
			return;
		}

		if (numShares === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				numShares = tradesInProgress[marketID][outcomeID].numShares;
			} else {
				numShares = 0;

			}
		}

		if (limitPrice === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				limitPrice = tradesInProgress[marketID][outcomeID].limitPrice;
			} else {
				limitPrice = 0;
			}
		}

		// if (numShares >= 0) {
		// 	simulation = AugurJS.getSimulatedBuy(marketID, outcomeID, numShares);
		// } else {
		// 	simulation = AugurJS.getSimulatedSell(marketID, outcomeID, Math.abs(numShares));
		// }

		dispatch({ type: UPDATE_TRADE_IN_PROGRESS, data: {
			marketID,
			outcomeID,
			details: {
				numShares,
				limitPrice,
				totalCost: numShares * limitPrice
			}
		} });
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
