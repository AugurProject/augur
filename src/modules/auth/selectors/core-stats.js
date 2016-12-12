import memoizerific from 'memoizerific';

import store from '../../../store';
import getValue from '../../../utils/get-value';
import { augur, abi } from '../../../services/augurjs';
import { dateToBlock } from '../../../utils/date-to-block-to-date';
import { formatEther } from '../../../utils/format-number';

export default function () {
	return selectCoreStats();
}

export function selectCoreStats() {
	const { accountTrades, blockchain, outcomesData } = store.getState();
	const { loginAccount, loginAccountPositions } = require('../../../selectors');

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
	const totalPL = getValue(loginAccountPositions, 'summary.totalNet');
	// const totalPLMonth = formatEther(selectPeriodPL(accountTrades, loginAccountPositions.markets, blockchain, outcomesData, 30));
	// const totalPLDay = formatEther(selectPeriodPL(accountTrades, loginAccountPositions.markets, blockchain, outcomesData, 1));
	const totalPLMonth = formatEther(selectPeriodPL(accountTrades, blockchain, outcomesData, 30));
	const totalPLDay = formatEther(selectPeriodPL(accountTrades, blockchain, outcomesData, 1));

	return [
		{
			totalEth: {
				label: 'ETH',
				title: 'Ether -- outcome trading currency',
				value: { ...totalEth, denomination: null }
			},
			totalRealEth: {
				label: 'Real ETH',
				title: 'Real Ether -- pays transaction gas fees',
				value: { ...loginAccount.realEther, denomination: null }
			},
			totalRep: {
				label: 'REP',
				title: 'Reputation -- event voting currency',
				value: { ...totalRep, denomination: null }
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
const selectPeriodPL = memoizerific(2)((accountTrades, blockchain, outcomesData, period) => {
	if (!accountTrades || !blockchain) {
		return null;
	}

	const periodDate = new Date(Date.now() - (period*24*60*60*1000));
	const periodBlock = dateToBlock(periodDate, blockchain.currentBlockNumber);

	return Object.keys(accountTrades).reduce((p, marketID) => { // Iterate over marketIDs
		if (!outcomesData[marketID]) return p;
		const accumulatedPL = Object.keys(accountTrades[marketID]).reduce((p, outcomeID) => { // Iterate over outcomes
			const periodTrades = accountTrades[marketID][outcomeID].filter(trade => trade.blockNumber > periodBlock); // Filter out trades older than 30 days
			const lastPrice = selectOutcomeLastPrice(outcomesData[marketID], outcomeID);
			const { realized, unrealized } = augur.calculateProfitLoss(periodTrades, lastPrice);

			return p.plus(abi.bignum(realized).plus(abi.bignum(unrealized)));
		}, abi.bignum(0));

		return p.plus(accumulatedPL);
	}, abi.bignum(0));
});

function selectOutcomeLastPrice(marketOutcomeData, outcomeID) {
	if (!marketOutcomeData || !outcomeID) return null;
	return (marketOutcomeData[outcomeID] || {}).price;
}
