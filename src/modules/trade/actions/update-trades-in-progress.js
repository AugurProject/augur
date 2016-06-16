// import * as AugurJS from '../../../services/augurjs';
import { BID } from '../../bids-asks/constants/bids-asks-types';

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
		let newNumShares = numShares;
		let newLimitPrice = limitPrice;
		let newSide = side;

		if (tradesInProgress[marketID] &&
			tradesInProgress[marketID][outcomeID] &&
			tradesInProgress[marketID][outcomeID].numShares === numShares &&
			tradesInProgress[marketID][outcomeID].limitPrice === limitPrice &&
			tradesInProgress[marketID][outcomeID].side === side) {
			return;
		}

		if (numShares === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				newNumShares = tradesInProgress[marketID][outcomeID].numShares;
			} else {
				newNumShares = 0;

			}
		}

		if (limitPrice === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				newLimitPrice = tradesInProgress[marketID][outcomeID].limitPrice;
			} else {
				newLimitPrice = 0;
			}
		}

		if (side === undefined) {
			if (tradesInProgress[marketID] && tradesInProgress[marketID][outcomeID]) {
				newSide = tradesInProgress[marketID][outcomeID].side;
			} else {
				newSide = BID;
			}
		}

		dispatch({ type: UPDATE_TRADE_IN_PROGRESS, data: {
			marketID,
			outcomeID,
			details: {
				numShares: newNumShares,
				limitPrice: newLimitPrice,
				totalCost: newNumShares * newLimitPrice,
				side: newSide
			}
		} });
	};
}

export function clearTradeInProgress(marketID) {
	return { type: CLEAR_TRADE_IN_PROGRESS, marketID };
}
