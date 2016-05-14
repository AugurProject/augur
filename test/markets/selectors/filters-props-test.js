import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/filters-props.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, selector, out, test;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockFilter = {
    toggleFilter: () => {}
  };
  sinon.stub(mockFilter, 'toggleFilter', (arg) => {
    return {
      type: 'TOGGLE_FILTER',
      filter: arg
    }
  });

  selector = proxyquire('../../../src/modules/markets/selectors/filters-props.js', {
    '../../../store': store,
    '../../markets/actions/toggle-filter': mockFilter
  });

  it(`should adjust and return filters props`, () => {
    test = selector.default();
    out = [{
      type: 'TOGGLE_FILTER',
      filter: 'isOpen'
    }, {
      type: 'TOGGLE_FILTER',
      filter: 'isExpired'
    }, {
      type: 'TOGGLE_FILTER',
      filter: 'isPendingReport'
    }, {
      type: 'TOGGLE_FILTER',
      filter: 'isMissedOrReported'
    }, {
      type: 'TOGGLE_FILTER',
      filter: 'isBinary'
    }, {
      type: 'TOGGLE_FILTER',
      filter: 'isCategorical'
    }, {
      type: 'TOGGLE_FILTER',
      filter: 'isScalar'
    }];

    test.onClickFilterOpen();
    test.onClickFilterExpired();
    test.onClickFilterPendingReport();
    test.onClickFilterMissedOrReported();
    test.onClickFilterBinary();
    test.onClickFilterCategorical();
    test.onClickFilterScalar();

    assert(test.isCheckedOpen, `isCheckedOpen wasn't true as expected`);
    assert(!test.isCheckedExpired, `isCheckedExpired wasn't false as expected`);
    assert(!test.isCheckedPendingReport, `isCheckedPendingReport wasn't false as expected`);
    assert(!test.isCheckedMissedOrReported, `isCheckedMissedOrReported wasn't false as expected`);
    assert(!test.isCheckedBinary, `isCheckedBinary wasn't false as expected`);
    assert(!test.isCheckedCategorical, `isCheckedCategorical wasn't false as expected`);
    assert(!test.isCheckedScalar, `isCheckedScalar wasn't false as expected`);

    assert.equal(mockFilter.toggleFilter.callCount, 7, `The Filter OnClick functions didn't dispatch the number of actions they should have`);

    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
  });
});
