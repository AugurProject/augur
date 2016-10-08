import makeNumber from '../utils/make-number';
import makeDate from '../utils/make-date';
import { M } from '../modules/site/constants/views';

export default [
	{
		id: '0',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[0], url: '/m/0' })
		},
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
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[1], url: '/m/1' })
		},
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
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[2], url: '/m/2' })
		},
		description: 'When will I stop balding?',
		endDate: makeDate(new Date('2017/12/12')),
		fees: makeNumber(Math.random() * 10, ' ETH'),
		volume: makeNumber(Math.floor(Math.random() * 100), null, true),
		numberOfTrades: makeNumber(Math.floor(Math.random() * 1000), null, true),
		averageTradeSize: makeNumber(Math.random() * 100, ' ETH', true),
		openVolume: makeNumber(Math.floor(Math.random() * 10000), null, true)
	}
];
