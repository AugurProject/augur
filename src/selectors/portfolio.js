import navItems from '../selectors/portfolio-nav-items';
import loginAccountMarkets from '../selectors/login-account-markets';

import { makeNumber } from '../../src/utils/make-number';

const randomSign = Math.random() < 0.5 ? -1 : 1;

const totals = {
	value: makeNumber(Math.random() * 1000, 'eth'),
	net: makeNumber(randomSign * Math.random() * 10, 'eth')
};

export default {
	navItems,
	loginAccountMarkets,
	totals
};
