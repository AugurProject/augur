import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from 'test/mockStore';

import { PAGE_PARAM_NAME, SEARCH_PARAM_NAME, TAGS_PARAM_NAME } from 'modules/link/constants/param-names';
import { MARKETS } from 'modules/app/constants/views';

describe('modules/markets/actions/update-selected-filter-sort', () => {
  proxyquire.noPreserveCache().noCallThru();

  const { store } = mockStore.default;
  const mockUpdateURL = { updateURL: () => {} };

  sinon.stub(mockUpdateURL, 'updateURL', href => ({
    type: 'UPDATE_URL',
    href
  }));

  const action = proxyquire('../../../src/modules/markets/actions/update-selected-filter-sort', {
    '../../link/actions/update-url': mockUpdateURL,
    '../../link/selectors/links': proxyquire('../../../src/modules/link/selectors/links', {
      '../../../store': store
    })
  });

  // const { makePaginationLink } = proxyquire('../../../src/modules/markets/selectors/pagination', {
  //   '../../link/selectors/links': proxyquire('../../../src/modules/link/selectors/links', {
  //     '../../../store': store
  //   })
  // });

  beforeEach(() => {
    store.clearActions();
    // Mock the Window object
    global.window = {};
    global.window.location = {
      pathname: '/'
    };
    global.window.history = {
      pushState: (a, b, c) => true
    };
    global.window.scrollTo = (x, y) => true;
  });

  afterEach(() => {
    store.clearActions();
    global.window = {};
  });

  it(`should return an UPDATE_SELECTED_FILTER_SORT action object`, () => {
    const filterSortChange = { sort: 'expiry' };
    store.dispatch(action.updateSelectedFilterSort(filterSortChange));

    const out = [
      {
        type: 'UPDATE_SELECTED_FILTER_SORT',
        selectedFilterSort: {
          sort: 'expiry'
        }
      },
      {
        type: 'UPDATE_URL',
        href: `/?${PAGE_PARAM_NAME}=${MARKETS}&${SEARCH_PARAM_NAME}=test%20testtag&${TAGS_PARAM_NAME}=testtag%2Ctag`
      }
    ];

    assert.deepEqual(store.getActions(), out, `Didn't return the correct action object`);
  });
});
