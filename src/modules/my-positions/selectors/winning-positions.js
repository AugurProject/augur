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
				selectWinningSharesInMarket(market);
			if (winningShares && winningShares.gt(ZERO)) {
				closedMarketsWithWinningShares.push({
					id: market.id,
					description: market.description,
					shares: winningShares.toFixed()
				});
			}
		}
	}
	return closedMarketsWithWinningShares;
});

export function selectTotalSharesInMarket(market) {
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
	return totalShares;
}

export function selectWinningSharesInMarket(market) {
	const marketOutcomeData = store.getState().outcomesData[market.id];
	const outcomeData = marketOutcomeData[market.reportedOutcome];
	if (outcomeData && outcomeData.sharesPurchased) {
		const sharesPurchased = abi.bignum(outcomeData.sharesPurchased);
		return sharesPurchased.gt(ZERO) ? sharesPurchased : null;
	}
}
