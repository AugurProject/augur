import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/reports/actions/update-reports.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, out, test;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockAugurJS = {};
  let mockMarketData = {};

  mockAugurJS.loadPendingReportEventIDs = sinon.stub();
  mockMarketData.isMarketDataOpen = sinon.stub();
  mockAugurJS.loadPendingReportEventIDs.yields(null, ['test1', 'test2', 'report1', 'report2']);
  mockMarketData.isMarketDataOpen.returns(false);

  action = proxyquire('../../../src/modules/reports/actions/update-reports', {
    '../../../services/augurjs': mockAugurJS,
    '../../../utils/is-market-data-open': mockMarketData
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should load reports given marketdata`, () => {
    out = [{
      type: 'UPDATE_REPORTS',
      reports: ['test1', 'test2', 'report1', 'report2']
    }];
    test = {
      test: {
        _id: 'test',
        data: 'test'
      },
      test2: {
        _id: 'test2',
        data: 'example'
      }
    };
    store.dispatch(action.loadReports(test));
    assert(mockAugurJS.loadPendingReportEventIDs.calledOnce, `loadPendingReportEventIDs wasn't called exactly 1 time.`);
    assert(mockMarketData.isMarketDataOpen.calledTwice, `isMarketDataOpen Didn't get called 2 times with only 2 markets as expected`);
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the UPDATE_REPORTS action`);
  });

  it(`should return a clear reports action`, () => {
    out = [{
      type: 'CLEAR_REPORTS'
    }];
    store.dispatch(action.clearReports());
    assert.deepEqual(store.getActions(), out, `Didn't dispatch a CLEAR REPORTS action`);
  });

});
