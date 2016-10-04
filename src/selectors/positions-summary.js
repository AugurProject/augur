import makeNumber from '../utils/make-number';
import { randomNum } from '../utils/random-number';

export default {
	numPositions: makeNumber(randomNum(), 'Positions', true),
	qtyShares: makeNumber(randomNum(), 'shares'),
	purchasePrice: makeNumber(randomNum(), ' ETH'),
	realizedNet: makeNumber(randomNum(900), ' ETH'),
	unrealizedNet: makeNumber(randomNum(100), ' ETH'),
	totalNet: makeNumber(randomNum(), ' ETH')
};
