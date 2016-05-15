import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/search-sort.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, selector, out, test;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockSort = {
    updateSelectedSort: () => {}
  };

  sinon.stub(mockSort, 'updateSelectedSort', (o) => {
    return {
      type: 'UPDATE_SELECTED_SORT',
      value: o
    }
  });

  selector = proxyquire('../../../src/modules/markets/selectors/search-sort.js', {
    '../../../store': store,
    '../../markets/actions/update-selected-sort': mockSort
  });

  it(`should return information about the sorting filters in search`, () => {
    test = selector.default();
    let actions = [{
      type: 'UPDATE_SELECTED_SORT',
      value: {
        prop: 'endBlock',
        isDesc: false
      }
    }];
    out = {
      selectedSort: {
        isDesc: true,
        prop: 'volume'
      },
      sortOptions: [{
        label: 'Newest Market',
        value: 'creationSortOrder',
        isDesc: true
      }, {
        label: 'Soonest Expiry',
        value: 'endBlock',
        isDesc: false
      }, {
        label: 'Most Volume',
        value: 'volume',
        isDesc: true
      }, {
        label: 'Lowest Fee',
        value: 'tradingFeePercent',
        isDesc: false
      }],
      onChangeSort: test.onChangeSort
    };

    test.onChangeSort('endBlock', false);

    assert(mockSort.updateSelectedSort.calledOnce, `updateSelectedSort wasn't called once as expected`);
    assert.deepEqual(store.getActions(), actions, `Didn't dispatch the expected action object when onChangeSort was called from output selector object`);
    assert.deepEqual(test, out, `Didn't produce the expected output object`);
  });
});
