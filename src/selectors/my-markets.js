import { makeNumber } from '../utils/make-number';
import { makeDate } from '../utils/make-date';

export default [
	{
		id: '0',
		description: 'Will the shoop, shoop de woop?',
		endDate: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10, ' ETH', true),
		volume: makeNumber(Math.floor(Math.random() * 100), null, true),
		numberOfTrades: makeNumber(Math.floor(Math.random() * 1000), null, true),
		averageTradeSize: makeNumber(Math.random() * 100, ' ETH'),
		openVolume: makeNumber(Math.floor(Math.random() * 10000), null, true)
	},
	{
		id: '1',
		description: 'When will the first zipline span the San Francisco Bay?',
		endDate: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10, ' ETH', true),
		volume: makeNumber(Math.floor(Math.random() * 100), null, true),
		numberOfTrades: makeNumber(Math.floor(Math.random() * 1000), null, true),
		averageTradeSize: makeNumber(Math.random() * 100, ' ETH', true),
		openVolume: makeNumber(Math.floor(Math.random() * 10000), null, true)
	},
	{
		id: '2',
		description: 'When will I stop balding?',
		endDate: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10, ' ETH'),
		volume: makeNumber(Math.floor(Math.random() * 100), null, true),
		numberOfTrades: makeNumber(Math.floor(Math.random() * 1000), null, true),
		averageTradeSize: makeNumber(Math.random() * 100, ' ETH', true),
		openVolume: makeNumber(Math.floor(Math.random() * 10000), null, true)
	}
];
