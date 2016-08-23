import { makeNumber } from '../utils/make-number';

export default [
	{
		id: '123',
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
