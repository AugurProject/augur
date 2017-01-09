import memoizerific from 'memoizerific';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import { SCALAR } from '../../markets/constants/market-types';

export default function (outcomesData) {
	const { portfolio } = require('../../../selectors');
	return selectClosedMarketsWithWinningShares(portfolio.positions.markets, outcomesData);
}

export const selectClosedMarketsWithWinningShares = memoizerific(1)((markets, outcomesData) => {
	const numPositions = markets.length;
	const closedMarketsWithWinningShares = [];
	for (let i = 0; i < numPositions; ++i) {
		const market = markets[i];
		if (!market.isOpen) {
			const marketID = market.id;
			const winningShares = market.type === SCALAR ?
				selectTotalSharesInMarket(market, outcomesData[marketID]) :
				selectWinningSharesInMarket(market, outcomesData[marketID]);
			if (winningShares && winningShares.gt(ZERO)) {
				closedMarketsWithWinningShares.push({
					id: marketID,
					description: market.description,
					shares: winningShares.toFixed()
				});
			}
		}
	}
	return closedMarketsWithWinningShares;
});

export function selectTotalSharesInMarket(market, marketOutcomesData) {
	const outcomeIDs = Object.keys(marketOutcomesData);
	const numOutcomes = outcomeIDs.length;
	let totalShares = ZERO;
	for (let j = 0; j < numOutcomes; ++j) {
		const bnSharesPurchased = abi.bignum(marketOutcomesData[outcomeIDs[j]].sharesPurchased);
		if (bnSharesPurchased.gt(ZERO)) {
			totalShares = totalShares.plus(bnSharesPurchased);
		}
	}
	return totalShares;
}

export function selectWinningSharesInMarket(market, marketOutcomesData) {
	const outcomeData = marketOutcomesData[market.reportedOutcome];
	if (outcomeData && outcomeData.sharesPurchased) {
		const sharesPurchased = abi.bignum(outcomeData.sharesPurchased);
		return sharesPurchased.gt(ZERO) ? sharesPurchased : null;
	}
}
