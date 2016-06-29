import { makeNumber } from '../utils/make-number';

export default {
	numPositions: makeNumber(100, 'Positions', true),
	qtyShares: makeNumber(500, 'shares'),
	purchasePrice: makeNumber(20, 'eth'),
	totalValue: makeNumber(1000, 'eth'),
	totalCost: makeNumber(10000, 'eth'),
	shareChange: makeNumber(-18, 'eth'),
	gainPercent: makeNumber(-90, '%'),
	netChange: makeNumber(-9000, 'eth')
};
