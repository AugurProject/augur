import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';

import sinon from 'sinon';

import selector from '../../../src/modules/portfolio/selectors/portfolio';
import * as selectPortfolioNavItems from '../../../src/modules/portfolio/selectors/portfolio-nav-items';
import * as selectPortfolioTotals from '../../../src/modules/portfolio/selectors/portfolio-totals';
import * as selectLoginAccountPositions from '../../../src/modules/my-positions/selectors/login-account-positions';
import * as selectLoginAccountMarkets from '../../../src/modules/my-markets/selectors/login-account-markets';

describe('modules/portfolio/selectors/portfolio', () => {
	let actual;

	const spiedNavItems = sinon.spy(selectPortfolioNavItems, 'default');
	const spiedPortfolioTotals = sinon.spy(selectPortfolioTotals, 'default');
	const spiedLoginAccountPositions = sinon.spy(selectLoginAccountPositions, 'default');
	const spiedLoginAccountMarkets = sinon.spy(selectLoginAccountMarkets, 'default');

	before(() => {
		actual = selector();
	});

	after(() => {
		selectPortfolioNavItems.default.restore();
		selectPortfolioTotals.default.restore();
		selectLoginAccountPositions.default.restore();
		selectLoginAccountMarkets.default.restore();
	});

	it(`should call 'selectPortfolioNavItems' once`, () => {
		assert(spiedNavItems.calledOnce, `Didn't call selectPortfolioNavItems once as expected`);
	});

	it(`should call 'selectPortfolioTotals' once`, () => {
		assert(spiedPortfolioTotals.calledOnce, `Didn't call 'selectPortfolioTotals' once as expected`);
	});

	it(`should call 'selectLoginAccountPositions' once`, () => {
		assert(spiedLoginAccountPositions.calledOnce, `Didn't call 'selectLoginAccountPositions' once as expected`);
	});

	it(`should call 'selectPortfolioTotals' once`, () => {
		assert(spiedLoginAccountMarkets.calledOnce, `Didn't call 'selectLoginAccountMarkets' once as expected`);
	});

	it(`should return the correct object to augur-ui-react-components`, () => {
		assertions.portfolio(actual);
	});
});