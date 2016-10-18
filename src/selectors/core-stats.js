import { randomNum } from '../utils/random-number';
import makeNumber from '../utils/make-number';

export default [
	{
		totalEth: {
			label: 'Total ETH',
			title: 'Ether -- outcome trading currency',
			value: makeNumber(Math.abs(randomNum(1000)), 'ETH')
		},
		totalRep: {
			label: 'Total REP',
			title: 'Reputation -- event voting currency',
			value: makeNumber(Math.abs(randomNum(100)), 'REP')
		}
	},
	{
		totalRiskedEth: {
			label: 'Risked ETH',
			title: 'Risked Ether -- Ether tied up in positions',
			value: makeNumber(Math.abs(randomNum(1000)), 'ETH')
		},
		totalAvailableEth: {
			label: 'Available ETH',
			title: 'Available Ether -- Ether not tied up in positions',
			value: makeNumber(Math.abs(randomNum(1000)), 'ETH')
		}
	},
	{
		totalPL: {
			label: 'Total P/L',
			tile: 'Profit/Loss -- net of all trades',
			value: makeNumber(randomNum(10), 'ETH')
		},
		totalPLMonth: {
			label: '30 Day P/L',
			tile: 'Profit/Loss -- net of all trades over the last 30 days',
			value: makeNumber(randomNum(10), 'ETH')
		},
		totalPLDay: {
			label: '1 Day P/L',
			tile: 'Profit/Loss -- net of all trades over the last day',
			value: makeNumber(randomNum(10), 'ETH')
		}
	}
];
