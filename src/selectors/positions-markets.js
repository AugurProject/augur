import { makeNumber } from '../utils/make-number';

export default [
	{
		id: '123',
		description: 'will there be a referendum on may 1?',
		outcomes: [
			{
				id: 1,
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					shareChange: makeNumber(-1, 'eth'),
					gainPercent: makeNumber(-9, '%'),
					netChange: makeNumber(-900, 'eth')
				},
				lastPrice: makeNumber(0.1, 'eth')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					shareChange: makeNumber(-1, 'eth'),
					gainPercent: makeNumber(-9, '%'),
					netChange: makeNumber(-900, 'eth')
				},
				lastPrice: makeNumber(0.1, 'eth')
			}
		]
	},
	{
		id: '234',
		description: 'Yoooooooooooooo, sup guy?',
		outcomes: [
			{
				id: 1,
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					shareChange: makeNumber(-1, 'eth'),
					gainPercent: makeNumber(-9, '%'),
					netChange: makeNumber(-900, 'eth')
				},
				lastPrice: makeNumber(0.1, 'eth')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(0.2, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					shareChange: makeNumber(-1, 'eth'),
					gainPercent: makeNumber(-9, '%'),
					netChange: makeNumber(-900, 'eth')
				},
				lastPrice: makeNumber(0.1, 'eth')
			}
		]
	}
];
