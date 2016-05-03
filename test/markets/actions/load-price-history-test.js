import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/actions/load-price-history.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, out;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockAugurJS = {};
  mockAugurJS.loadPriceHistory = sinon.stub();


  action = proxyquire('../../../src/modules/markets/actions/load-price-history', {
    '../../../services/augurjs': mockAugurJS
  });

  it(`should call AugurJS loadPriceHistory`, () => {
    store.dispatch(action.loadPriceHistory('test'));
    assert(mockAugurJS.loadPriceHistory.calledOnce);
  });
});
