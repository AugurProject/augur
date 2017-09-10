import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/branch/actions/update-branch.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = Object.assign({}, testState);
  const store = mockStore(state);
  const action = proxyquire('../../../src/modules/branch/actions/update-branch.js', {});
  it('should dispatch UPDATE_BRANCH action', () => {
    store.dispatch(action.updateBranch({
      currentReportingPeriodPercentComplete: 52,
      currentReportingWindowAddress: 18,
      reportingPeriodDurationInSeconds: 900
    }));
    assert.deepEqual(store.getActions(), [{
      type: 'UPDATE_BRANCH',
      branch: {
        currentReportingPeriodPercentComplete: 52,
        currentReportingWindowAddress: 18,
        reportingPeriodDurationInSeconds: 900
      }
    }]);
    store.clearActions();
  });
});
