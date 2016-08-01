import { assert } from 'chai';
import { assertions } from 'augur-ui-react-components';

import sinon from 'sinon';

import selector from '../../../src/modules/portfolio/selectors/portfolio';
import * as selectPortfolioNavItems from '../../../src/modules/portfolio/selectors/nav-items';
import * as selectPortfolioSummaries from '../../../src/modules/portfolio/selectors/summaries';
import * as selectLoginAccountMarkets from '../../../src/modules/portfolio/selectors/login-account-markets';

describe('modules/portfolio/selectors/portfolio', () => {
	let actual;

	const spiedNavItems = sinon.spy(selectPortfolioNavItems, 'default');
	const spiedPortfolioSummaries = sinon.spy(selectPortfolioSummaries, 'default');
	const spiedLoginAccountMarkets = sinon.spy(selectLoginAccountMarkets, 'default');

	before(() => {
		actual = selector();
	});

	after(() => {
		selectPortfolioNavItems.default.restore();
		selectPortfolioSummaries.default.restore();
		selectLoginAccountMarkets.default.restore();
	});

	it(`should call 'spiedNavItems' once`, () => {
		assert(spiedNavItems.calledOnce, `Didn't call selectPortfolioNavItems once as expected`);
	});

	it(`should call 'spiedPortfolioSummaries' once`, () => {
		assert(spiedPortfolioSummaries.calledOnce, `Didn't call 'selectPortfolioSummaries once as expected`);
	});

	it(`should call 'spiedLoginAccountMarkets' once`, () => {
		assert(spiedLoginAccountMarkets.calledOnce, `Didn't call 'selectLoginAccountMarkets once as expected`);
	});

	it(`should return the correct object to augur-ui-react-components`, () => {
		assertions.portfolio(actual);
	});
});