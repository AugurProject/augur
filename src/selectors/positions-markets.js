import { makeNumber } from '../utils/make-number';
import { M } from '../modules/site/constants/pages';

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
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, ' ETH'),
					shareChange: makeNumber(-0.1, ' ETH'),
					totalCost: makeNumber(1000, ' ETH'),
					totalValue: makeNumber(100, ' ETH'),
					netChange: makeNumber(-900, ' ETH'),
					gainPercent: makeNumber(-9, '%')
				},
				lastPrice: makeNumber(0.1, ' ETH')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, ' ETH'),
					shareChange: makeNumber(-0.1, ' ETH'),
					totalCost: makeNumber(1000, ' ETH'),
					totalValue: makeNumber(100, ' ETH'),
					netChange: makeNumber(-900, ' ETH'),
					gainPercent: makeNumber(-9, '%')
				},
				lastPrice: makeNumber(0.1, ' ETH')
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
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, ' ETH'),
					shareChange: makeNumber(-0.1, ' ETH'),
					totalCost: makeNumber(1000, ' ETH'),
					totalValue: makeNumber(100, ' ETH'),
					netChange: makeNumber(-900, ' ETH'),
					gainPercent: makeNumber(-9, '%')
				},
				lastPrice: makeNumber(0.1, ' ETH')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, ' ETH'),
					shareChange: makeNumber(-0.1, ' ETH'),
					totalCost: makeNumber(1000, ' ETH'),
					totalValue: makeNumber(100, ' ETH'),
					netChange: makeNumber(-900, ' ETH'),
					gainPercent: makeNumber(-9, '%')
				},
				lastPrice: makeNumber(0.1, ' ETH')
			}
		]
	}
];
