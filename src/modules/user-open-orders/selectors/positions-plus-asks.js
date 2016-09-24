import memoizerific from 'memoizerific';
import { ZERO } from '../../trade/constants/numbers';
import { abi } from '../../../services/augurjs';
import { isOrderOfUser } from '../../bids-asks/helpers/is-order-of-user';

/**
 * @param {String} account
 * @param {Object} positions
 * @param {Object} orderBooks
 * @return {Object} Total number of shares in positions and open ask orders.
 */
export const selectPositionsPlusAsks = memoizerific(10)((account, positions, orderBooks) => {
	const adjustedMarkets = Object.keys(positions);
	const numAdjustedMarkets = adjustedMarkets.length;
	const positionsPlusAsks = {};
	let marketID;
	for (let i = 0; i < numAdjustedMarkets; ++i) {
		marketID = adjustedMarkets[i];
		if (orderBooks[marketID]) {
			positionsPlusAsks[marketID] = selectMarketPositionPlusAsks(account, positions[marketID], orderBooks[marketID].sell);
		}
	}
	return positionsPlusAsks;
});

/**
 * @param {String} marketID
 * @param {String} account
 * @param {Object} position
 * @param {Object} asks
 * @return {Object} Total number of shares in positions and open ask orders.
 */
export const selectMarketPositionPlusAsks = memoizerific(10)((account, position, asks) => {
	const positionPlusAsks = {};
	if (asks) {
		const adjustedOutcomes = Object.keys(position);
		const numAdjustedOutcomes = adjustedOutcomes.length;
		for (let j = 0; j < numAdjustedOutcomes; ++j) {
			positionPlusAsks[adjustedOutcomes[j]] = abi.bignum(position[adjustedOutcomes[j]]).plus(getOpenAskShares(account, adjustedOutcomes[j], asks)).toFixed();
		}
	}
	return positionPlusAsks;
});

/**
 * @param {String} outcomeID
 * @param {String} account
 * @param {Object} askOrders
 * @return {BigNumber} Total number of shares in open ask orders.
 */
function getOpenAskShares(account, outcomeID, askOrders) {
	if (!account || !askOrders) return ZERO;
	let order;
	let askShares = ZERO;
	const orderIDs = Object.keys(askOrders);
	const numOrders = orderIDs.length;
	for (let i = 0; i < numOrders; ++i) {
		order = askOrders[orderIDs[i]];
		if (isOrderOfUser(order, account) && order.outcome === outcomeID) {
			askShares = askShares.plus(abi.bignum(order.amount));
		}
	}
	return askShares;
}
