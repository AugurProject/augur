import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/app/actions/update-blockchain.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let store, action, out;
  let state = Object.assign({}, testState);
  store = mockStore(state);
  let mockAugurJS = {
    loadCurrentBlock: () => {},
    getReportPeriod: () => {},
    incrementPeriodAfterReporting: () => {}
  };
  let mockCommitReports = {
    commitReports: () => {}
  };
  let mockPenalize = {
    penalizeTooFewReports: () => {}
  };
  let mockCollectFees = {
    collectFees: () => {}
  };

  action = proxyquire('../../../src/modules/app/actions/update-blockchain.js', {
    '../../../services/augurjs': mockAugurJS,
    '../../reports/actions/commit-reports': mockCommitReports,
    '../../reports/actions/penalize-too-few-reports': mockPenalize,
    '../../reports/actions/collect-fees': mockCollectFees
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should dispatch an update blockchain action`);
});
