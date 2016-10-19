import memoizerific from 'memoizerific';

import store from '../../../store';
import get from '../../../utils/get';
import { augur, abi } from '../../../services/augurjs';
import { dateToBlock } from '../../../utils/date-to-block-to-date';

export default function () {
	return selectCoreStats();
}

export function selectCoreStats() {
	const { accountTrades, blockchain } = store.getState();
	const { loginAccount, loginAccountPositions } = require('../../../selectors');

	// Group 1
	const totalEth = loginAccount.eth;
	const totalRep = loginAccount.rep;

	// Group 2
	// Total Risked
	// Total Available

	// Group 3
	const totalPL = get(loginAccountPositions, 'summary.totalNet');
	const thirtyDayPL = selectPeriodPL(accountTrades, loginAccountPositions.markets, blockchain, 30);
	const oneDayPL = selectPeriodPL(accountTrades, loginAccountPositions.markets, blockchain, 1);

	// const coreStats = [
	// 	{
	//
	// 	}
	// ]
}

// function selectCortStatsProfitLoss(){
// 	// const totalPL = augur.calculateProfitLoss(trades, lastPrice, adjustedPosition);
// }

// Period is in days
const selectPeriodPL = memoizerific(2)((accountTrades, markets, blockchain, period) => {
	if (!accountTrades || !markets || !blockchain) {
		return null;
	}

	const periodDate = new Date(Date.now() - period*24*60*60*1000);
	const periodBlock = dateToBlock(periodDate, blockchain.currentBlockNumber);

	return Object.keys(accountTrades).reduce((p, marketID) => { // Iterate over marketIDs
		const accumulatedPL = Object.keys(accountTrades[marketID]).reduce((p, outcomeID) => { // Iterate over outcomes
			const periodTrades = accountTrades[marketID][outcomeID].filter(trade => trade.blockNumber > periodBlock); // Filter out trades older than 30 days
			const lastPrice = selectOutcomeLastPrice(markets, marketID, outcomeID);
			const { realized, unrealized } = augur.calculateProfitLoss(periodTrades, lastPrice);

			return p.plus(abi.bignum(realized).plus(abi.bignum(unrealized)));
		}, abi.bignum(0));

		return p.plus(accumulatedPL);
	}, abi.bignum(0));
});

function selectOutcomeLastPrice(markets, marketID, outcomeID) {
	if (!markets || !markets.length || !marketID || !outcomeID) {
		return null;
	}

	const market = markets.find(market => market.id === marketID);
	const outcome = market.outcomes.find(outcome => outcome.id === outcomeID);

	return outcome.lastPrice.value;
}
