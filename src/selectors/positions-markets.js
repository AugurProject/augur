import { makeNumber } from '../utils/make-number';
import { M } from '../modules/site/constants/pages';

const randomSign = () => (Math.random() > 0.5 ? 1 : -1);
const randomNum = (multiplier = 10) => Math.random() * multiplier * randomSign();

export default [
	{
		id: '123',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activePage: M, market: require('../selectors').markets[0], url: '/m/0' })
		},
		description: 'will there be a referendum on may 1?',
		myPositionOutcomes: [
			{
				id: 1,
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					shareChange: makeNumber(randomNum(1), ' ETH'),
					totalCost: makeNumber(randomNum(1000), ' ETH'),
					totalValue: makeNumber(randomNum(100), ' ETH'),
					netChange: makeNumber(randomNum(900), ' ETH'),
					netChangePercent: makeNumber(randomNum(), '%'),
					netChangeUnrealized: makeNumber(randomNum(100), ' ETH'),
					netChangePercentUnrealized: makeNumber(randomNum(), '%')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					shareChange: makeNumber(randomNum(1), ' ETH'),
					totalCost: makeNumber(randomNum(1000), ' ETH'),
					totalValue: makeNumber(randomNum(100), ' ETH'),
					netChange: makeNumber(randomNum(900), ' ETH'),
					netChangePercent: makeNumber(randomNum(), '%'),
					netChangeUnrealized: makeNumber(randomNum(100), ' ETH'),
					netChangePercentUnrealized: makeNumber(randomNum(), '%')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			}
		]
	},
	{
		id: '234',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activePage: M, market: require('../selectors').markets[1], url: '/m/1' })
		},
		description: 'Yoooooooooooooo, sup guy?',
		myPositionOutcomes: [
			{
				id: 1,
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					shareChange: makeNumber(randomNum(1), ' ETH'),
					totalCost: makeNumber(randomNum(1000), ' ETH'),
					totalValue: makeNumber(randomNum(100), ' ETH'),
					netChange: makeNumber(randomNum(900), ' ETH'),
					netChangePercent: makeNumber(randomNum(), '%'),
					netChangeUnrealized: makeNumber(randomNum(100), ' ETH'),
					netChangePercentUnrealized: makeNumber(randomNum(), '%')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					shareChange: makeNumber(randomNum(1), ' ETH'),
					totalCost: makeNumber(randomNum(1000), ' ETH'),
					totalValue: makeNumber(randomNum(100), ' ETH'),
					netChange: makeNumber(randomNum(900), ' ETH'),
					netChangePercent: makeNumber(randomNum(), '%'),
					netChangeUnrealized: makeNumber(randomNum(100), ' ETH'),
					netChangePercentUnrealized: makeNumber(randomNum(), '%')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			}
		]
	}
];
