import { makeNumber } from '../../src/utils/make-number';

const randomSign = Math.random() < 0.5 ? -1 : 1;

export default {
	value: makeNumber(Math.random() * 1000, 'eth'),
	net: makeNumber(randomSign * Math.random() * 10, 'eth')
};
