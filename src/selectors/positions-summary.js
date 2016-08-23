import { makeNumber } from '../utils/make-number';

export default {
	numPositions: makeNumber(100, 'Positions', true),
	qtyShares: makeNumber(500, 'shares'),
	purchasePrice: makeNumber(20, ' ETH'),
	totalValue: makeNumber(1000, ' ETH'),
	totalCost: makeNumber(10000, ' ETH'),
	shareChange: makeNumber(-18, ' ETH'),
	gainPercent: makeNumber(-90, '%'),
	netChange: makeNumber(-9000, ' ETH')
};
