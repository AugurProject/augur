// import * as AugurJS from '../../../services/augurjs';
import { BID } from '../../bids-asks/constants/bids-asks-types';

export const UPDATE_TRADE_IN_PROGRESS = 'UPDATE_TRADE_IN_PROGRESS';
export const CLEAR_TRADE_IN_PROGRESS = 'CLEAR_TRADE_IN_PROGRESS';

export function updateTradesInProgress(marketID, outcomeID, numShares, limitPrice, side) {
	return (dispatch, getState) => {
		const tradesInProgress = getState().tradesInProgress;
		let updatedNumShares = numShares;
		let updatedLimitPrice = limitPrice;
		let updatedSide = side;

		if (tradesInProgress[marketID] &&
			tradesInProgress[marketID][outcomeID] &&
			tradesInProgress[marketID][outcomeID].numShares === numShares &&
			tradesInProgress[marketID][outcomeID].limitPrice === limitPrice &&
			tradesInProgress[marketID][outcomeID].side === side) {
			return;
		}

		if (numShares === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				updatedNumShares = tradesInProgress[marketID][outcomeID].numShares;
			} else {
				updatedNumShares = 0;

			}
		}

		if (limitPrice === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				updatedLimitPrice = tradesInProgress[marketID][outcomeID].limitPrice;
			} else {
				updatedLimitPrice = 0;
			}
		}

		if (side === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				updatedSide = tradesInProgress[marketID][outcomeID].side;
			} else {
				updatedSide = BID;
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
				numShares: updatedNumShares,
				limitPrice: updatedLimitPrice,
				totalCost: numShares * limitPrice,
				side: updatedSide
			}
		} });
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
