import { describe, it, before } from 'mocha';
import { assert } from 'chai';
// import assertions from 'augur-ui-react-components/lib/assertions';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('modules/portfolio/selectors/portfolio', () => {
	proxyquire.noPreserveCache().noCallThru();

	let actual;

	const selectors = {
		selectPortfolioNavItems: () => {},
		selectPortfolioTotals: () => {},
		selectLoginAccountPositions: () => {},
		selectLoginAccountMarkets: () => {}

	};

	const stubbedNavItems = sinon.stub(selectors, 'selectPortfolioNavItems');
	const stubbedPortfolioTotals = sinon.stub(selectors, 'selectPortfolioTotals');
	const stubbedLoginAccountPositions = sinon.stub(selectors, 'selectLoginAccountPositions');
	const stubbedLoginAccountMarkets = sinon.stub(selectors, 'selectLoginAccountMarkets');

	const proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/portfolio', {
		'../../../modules/portfolio/selectors/portfolio-nav-items': stubbedNavItems,
		'../../../modules/portfolio/selectors/portfolio-totals': stubbedPortfolioTotals,
		'../../../modules/my-positions/selectors/login-account-positions': stubbedLoginAccountPositions,
		'../../../modules/my-markets/selectors/login-account-markets': stubbedLoginAccountMarkets
	});

	before(() => {
		actual = proxiedSelector.default();
	});

	it(`should call 'selectPortfolioNavItems' once`, () => {
		assert(stubbedNavItems.calledOnce, `Didn't call selectPortfolioNavItems once as expected`);
	});

	it(`should call 'selectPortfolioTotals' once`, () => {
		assert(stubbedPortfolioTotals.calledOnce, `Didn't call 'selectPortfolioTotals' once as expected`);
	});

	it(`should call 'selectLoginAccountPositions' once`, () => {
		assert(stubbedLoginAccountPositions.calledOnce, `Didn't call 'selectLoginAccountPositions' once as expected`);
	});

	it(`should call 'selectPortfolioTotals' once`, () => {
		assert(stubbedLoginAccountMarkets.calledOnce, `Didn't call 'selectLoginAccountMarkets' once as expected`);
	});

	it(`should return the correct object to augur-ui-react-components`, () => {
		// assertions.portfolio(actual);
		assert.isDefined(actual); // NOTE -- just a placeholder while the assertions are commented out.
	});
});
