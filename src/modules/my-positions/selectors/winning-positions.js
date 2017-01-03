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
			if (winningShares && winningShares.gt(ZERO)) {
				console.log('winning shares:', market, winningShares.toFixed());
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
	console.log('total shares in market:', market, totalShares.toFixed());
	return totalShares;
}

function selectWinningOutcomeShares(market) {
	const { outcomesData } = store.getState();
	const marketID = market.id;
	const outcomeIDs = Object.keys(outcomesData[marketID]);
	const numOutcomes = outcomeIDs.length;
	for (let j = 0; j < numOutcomes; ++j) {
		return selectWinningShares(market, outcomeIDs[j], outcomesData[marketID][outcomeIDs[j]]);
	}
}

function selectWinningShares(market, outcomeID, outcomeData) {
	console.log('selectWinningShares:', market.reportedOutcome, outcomeID, outcomeData);
	if (abi.bignum(outcomeID).eq(abi.bignum(market.reportedOutcome)) && outcomeData.sharesPurchased) {
		const sharesPurchased = abi.bignum(outcomeData.sharesPurchased);
		if (sharesPurchased.gt(ZERO)) {
			return sharesPurchased;
		}
	}
}
