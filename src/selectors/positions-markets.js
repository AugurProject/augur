import { makeNumber } from '../utils/make-number';

export default [
	{
		marketID: '123',
		description: 'will there be a referendum on may 1?',
		outcomes: [
			{
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(10, 'Positions', true),
					qtyShares: makeNumber(50, 'shares'),
					purchasePrice: makeNumber(2, 'eth'),
					totalValue: makeNumber(100, 'eth'),
					totalCost: makeNumber(1000, 'eth'),
					shareChange: makeNumber(-1, 'eth'),
					gainPercent: makeNumber(-9, '%'),
					netChange: makeNumber(-900, 'eth')
				}
			}
		]
	}
];
