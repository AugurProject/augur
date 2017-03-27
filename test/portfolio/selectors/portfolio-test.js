import { describe, it, before } from 'mocha';
import { assert } from 'chai';
import portfolioAssertions from 'assertions/portfolio';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe('modules/portfolio/selectors/portfolio', () => {
  proxyquire.noPreserveCache().noCallThru();

  let actual;

  const selectors = {
    selectPortfolioNavItems: () => {},
    selectPortfolioTotals: () => {}
  };

  const stubbedNavItems = sinon.stub(selectors, 'selectPortfolioNavItems');
  const stubbedPortfolioTotals = sinon.stub(selectors, 'selectPortfolioTotals');

  const proxiedSelector = proxyquire('../../../src/modules/portfolio/selectors/portfolio', {
    './portfolio-nav-items': stubbedNavItems,
    './portfolio-totals': stubbedPortfolioTotals
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

  it(`should return the correct object to augur-ui-react-components`, () => {
    portfolioAssertions(actual);
  });
});
