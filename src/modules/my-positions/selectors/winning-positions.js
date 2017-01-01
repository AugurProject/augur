import memoizerific from 'memoizerific';
import store from '../../../store';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SCALAR } from '../../markets/constants/market-types';

export default function () {
	const { portfolio } = require('../../../selectors');
	return selectClosedMarketsWithWinningShares(portfolio.positions.markets);
}

export const selectClosedMarketsWithWinningShares = memoizerific(1)((markets) => {
	const numPositions = markets.length;
	const closedMarketsWithWinningShares = [];
	for (let i = 0; i < numPositions; ++i) {
		const market = markets[i];
		if (!market.isOpen) {
			const winningShares = market.type === SCALAR ?
				selectTotalSharesInMarket(market) :
				selectWinningOutcomeShares(market);
			if (winningShares) {
				closedMarketsWithWinningShares.push({
					id: market.id,
					description: market.description,
					shares: winningShares
				});
			}
		}
	}
	return closedMarketsWithWinningShares;
});

function selectWinningOutcomeShares(market) {
	const { outcomesData } = store.getState();
	const marketID = market.id;
	const outcomeIDs = Object.keys(outcomesData[marketID]);
	const numOutcomes = outcomeIDs.length;
	for (let j = 0; j < numOutcomes; ++j) {
		return selectWinningShares(market, outcomeIDs[j], outcomesData[marketID][outcomeIDs[j]]);
	}
}

function selectTotalSharesInMarket(market) {
	const { outcomesData } = store.getState();
	const marketID = market.id;
	const outcomeIDs = Object.keys(outcomesData[marketID]);
	const numOutcomes = outcomeIDs.length;
	let totalShares = ZERO;
	for (let j = 0; j < numOutcomes; ++j) {
		const bnSharesPurchased = abi.bignum(outcomesData[marketID][outcomeIDs[j]].sharesPurchased);
		if (bnSharesPurchased.gt(ZERO)) {
			totalShares = totalShares.plus(bnSharesPurchased);
		}
	}
	return totalShares.toFixed();
}

function selectWinningShares(market, outcomeID, outcomeData) {
	if (outcomeID.toString() === market.reportedOutcome && outcomeData.sharesPurchased) {
		const sharesPurchased = abi.bignum(outcomeData.sharesPurchased);
		if (sharesPurchased.gt(ZERO)) {
			return sharesPurchased.toFixed();
		}
	}
}
