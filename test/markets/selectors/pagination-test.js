import { describe, it, beforeEach, after } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from 'test/mockStore';
import paginationAssertions from 'assertions/pagination';

import links from 'modules/link/selectors/links';

import { PAGE_PARAM_NAME, SEARCH_PARAM_NAME, TAGS_PARAM_NAME } from 'modules/link/constants/param-names';

describe(`modules/markets/selectors/pagination.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  let actual;
  let expected;
  const { state, store } = mockStore.default;

  const mockPage = {
    updateSelectedPageNum: () => {}
  };
  const mockSelectors = {
    links: links(),
    marketsTotals: {
      numUnpaginated: 100
    }
  };
  const MarketsTotals = {
    selectMarketsTotals: () => mockSelectors.marketsTotals
  };
  sinon.stub(mockPage, 'updateSelectedPageNum', (pageNum, href) => ({
    type: 'UPDATE_SELECTED_PAGE_NUM',
    pageNum
  }));

  const selector = proxyquire('../../../src/modules/markets/selectors/pagination.js', {
    '../../../store': store,
    '../../../selectors': mockSelectors,
    '../actions/update-selected-page-num': mockPage,
    './markets-totals': MarketsTotals
  });

  const { makePaginationLink } = proxyquire('../../../src/modules/markets/selectors/pagination', {
    '../../../selectors': proxyquire('../../../src/selectors', {
      './selectors-raw': proxyquire('../../../src/selectors-raw', {
        './modules/link/selectors/links': proxyquire('../../../src/modules/link/selectors/links', {
          '../../../store': store
        })
      })
    })
  });

  beforeEach(() => {
    store.clearActions();
  });

  after(() => {
    store.clearActions();
  });

  it(`should change the selected page number`, () => {
    actual = selector.default();

    expected = [{
      type: 'UPDATE_SELECTED_PAGE_NUM',
      pageNum: 4
    }];

    const href = selector.makePaginationLink(4, actual).href;

    actual.onUpdateSelectedPageNum(4, href);

    assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action objects when onUpdateSelectedPageNum was called.`);
  });

  it('should deliver the correct shape to AURC', () => {
    actual = selector.selectPagination({
      ...state,
      pagination: { ...state.pagination, selectedPageNum: 2 }
    });

    paginationAssertions(actual);
  });

  it('should return the expected pagination href from `makePaginationLink`', () => {
    actual = makePaginationLink(2, selector.default()).href;

    expected = `/?${PAGE_PARAM_NAME}=2&${SEARCH_PARAM_NAME}=test%20testtag&${TAGS_PARAM_NAME}=testtag%2Ctag`;

    assert.equal(actual, expected, 'generated href was not the expected string');
  });

  it('should return the expected actions when `onClick` is called from `makePaginationLink`', () => {
    actual = makePaginationLink(3, selector.default()).onClick();

    expected = [{
      type: 'UPDATE_SELECTED_PAGE_NUM',
      pageNum: 3
    }];

    assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected actions`);
  });
});
