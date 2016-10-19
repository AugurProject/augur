import memoizerific from 'memoizerific';

import store from '../../../store';
import get from '../../../utils/get';
import { augur, abi } from '../../../services/augurjs';
import { dateToBlock } from '../../../utils/date-to-block-to-date';
import { formatEther } from '../../../utils/format-number';

export default function () {
	return selectCoreStats();
}

export function selectCoreStats() {
	const { accountTrades, blockchain } = store.getState();
	const { loginAccount, loginAccountPositions, userOpenOrders } = require('../../../selectors');

	// Group 1
	const totalEth = loginAccount.ether;
	const totalRep = loginAccount.rep;

	// console.log('accountPositions -- ', userOpenOrders);

	// NOTE -- group two is excluded for now due to not having all OPEN orders available without calling against every market
	// Group 2
	// Total Risked
	// const totalRiskedEth = formatEther(0);
	// // Total Available
	// const totalAvailableEth = formatEther(0);

	// Group 3
	const totalPL = get(loginAccountPositions, 'summary.totalNet');
	const totalPLMonth = formatEther(selectPeriodPL(accountTrades, loginAccountPositions.markets, blockchain, 30));
	const totalPLDay = formatEther(selectPeriodPL(accountTrades, loginAccountPositions.markets, blockchain, 1));

	return [
		{
			totalEth: {
				label: 'Total ETH',
				title: 'Ether -- outcome trading currency',
				value: totalEth
			},
			totalRep: {
				label: 'Total REP',
				title: 'Reputation -- event voting currency',
				value: totalRep
			}
		},
		// {
		// 	totalRiskedEth: {
		// 		label: 'Risked ETH',
		// 		title: 'Risked Ether -- Ether tied up in positions',
		// 		value: totalRiskedEth
		// 	},
		// 	totalAvailableEth: {
		// 		label: 'Available ETH',
		// 		title: 'Available Ether -- Ether not tied up in positions',
		// 		value: totalAvailableEth
		// 	}
		// },
		{
			totalPL: {
				label: 'Total P/L',
				tile: 'Profit/Loss -- net of all trades',
				value: totalPL
			},
			totalPLMonth: {
				label: '30 Day P/L',
				tile: 'Profit/Loss -- net of all trades over the last 30 days',
				value: totalPLMonth
			},
			totalPLDay: {
				label: '1 Day P/L',
				tile: 'Profit/Loss -- net of all trades over the last day',
				value: totalPLDay
			}
		}
	];
}

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
