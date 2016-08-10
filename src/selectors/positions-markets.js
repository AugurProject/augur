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
					purchasePrice: makeNumber(0.2, 'eth'),
					shareChange: makeNumber(-0.1, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					netChange: makeNumber(-900, 'eth'),
					gainPercent: makeNumber(-9, '%')
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
					shareChange: makeNumber(-0.1, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					netChange: makeNumber(-900, 'eth'),
					gainPercent: makeNumber(-9, '%')
				},
				lastPrice: makeNumber(0.1, 'eth')
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
					purchasePrice: makeNumber(0.2, 'eth'),
					shareChange: makeNumber(-0.1, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					netChange: makeNumber(-900, 'eth'),
					gainPercent: makeNumber(-9, '%')
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
					shareChange: makeNumber(-0.1, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					netChange: makeNumber(-900, 'eth'),
					gainPercent: makeNumber(-9, '%')
				},
				lastPrice: makeNumber(0.1, 'eth')
			}
		]
	}
];
