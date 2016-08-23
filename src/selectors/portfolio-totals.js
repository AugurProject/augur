import { makeNumber } from '../../src/utils/make-number';

const randomSign = Math.random() < 0.5 ? -1 : 1;

export default {
	totalValue: makeNumber(Math.random() * 1000, ' ETH'),
	netChange: makeNumber(randomSign * Math.random() * 10, ' ETH')
};
