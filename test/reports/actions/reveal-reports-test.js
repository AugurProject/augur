import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe('modules/reports/actions/reveal-reports.js', () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const reports = {
    [testState.branch.id]: {
      test1: {
        eventID: 'test1',
        marketID: 'market1',
        reportHash: '0xtesthash123456789testhash1',
        salt: 'salt1',
        period: 19,
        isRevealed: false,
        reportedOutcomeID: 'testOutcomeID1',
        minValue: '1',
        maxValue: '2',
        isUnethical: false,
        isIndeterminate: true,
        isCategorical: false,
        isScalar: false
      },
      test2: {
        eventID: 'test2',
        marketID: 'market2',
        reportHash: '0xtesthash123456789testhash2',
        salt: 'salt2',
        period: 19,
        isRevealed: false,
        reportedOutcomeID: 'testOutcomeID2',
        minValue: '5',
        maxValue: '20',
        isUnethical: false,
        isIndeterminate: false,
        isCategorical: false,
        isScalar: true
      },
      test3: {
        eventID: 'test3',
        marketID: 'market3',
        reportHash: '0xtesthash123456789testhash3',
        salt: 'salt3',
        period: 19,
        isRevealed: false,
        reportedOutcomeID: 'testOutcomeID3',
        minValue: '1',
        maxValue: '2',
        isUnethical: true,
        isIndeterminate: false,
        isCategorical: false,
        isScalar: false
      }
    }
  };
  const state = Object.assign({}, testState, {
    loginAccount: {
      ...testState.loginAccount,
      ether: 100,
      rep: 100,
      realEther: 100
    },
    reports
  });
  const store = mockStore(state);

  const mockUpdateAssets = { updateAssets: () => {} };
  const mockAugurJS = {
    augur: {
      reporting: { submitReport: () => {}, },
      getTxGasEth: () => {},
      rpc: { gasPrice: 10 },
      tx: { MakeReports: { submitReport: {} } }
    }
  };

  sinon.stub(mockUpdateAssets, 'updateAssets', () => ({ type: 'UPDATE_ASSETS' }));
  sinon.stub(mockAugurJS.augur, 'getTxGasEth', (tx, gasPrice) => 1);
  sinon.stub(mockAugurJS.augur.reporting, 'submitReport', (o) => {
    const message = 'revealed report: testOutcome 2';
    const hash = '0xdeadbeef';
    o.onSent({ status: 'submitted', hash, message });
    o.onSuccess({ status: 'success', hash, message, gasFees: 1, timestamp: 100 });
  });

  const action = proxyquire('../../../src/modules/reports/actions/reveal-reports.js', {
    '../../auth/actions/update-assets': mockUpdateAssets,
    '../../../services/augurjs': mockAugurJS
  });

  beforeEach(() => {
    store.clearActions();
  });

  it('should reveal reports', () => {
    const out = [{
      type: 'UPDATE_ASSETS'
    }, {
      type: 'UPDATE_REPORTS',
      reports: {
        '0xf69b5': {
          test1: {
            eventID: 'test1',
            marketID: 'market1',
            reportHash: '0xtesthash123456789testhash1',
            salt: 'salt1',
            period: 19,
            isRevealed: true,
            reportedOutcomeID: 'testOutcomeID1',
            minValue: '1',
            maxValue: '2',
            isUnethical: false,
            isIndeterminate: true,
            isCategorical: false,
            isScalar: false
          }
        }
      }
    },
    {
      type: 'UPDATE_ASSETS'
    },
    {
      reports: {
        '0xf69b5': {
          test2: {
            eventID: 'test2',
            isCategorical: false,
            isIndeterminate: false,
            isRevealed: true,
            isScalar: true,
            isUnethical: false,
            marketID: 'market2',
            maxValue: '20',
            minValue: '5',
            period: 19,
            reportHash: '0xtesthash123456789testhash2',
            reportedOutcomeID: 'testOutcomeID2',
            salt: 'salt2',
          }
        }
      },
      type: 'UPDATE_REPORTS'
    },
    {
      type: 'UPDATE_ASSETS'
    },
    {
      reports: {
        '0xf69b5': {
          test3: {
            eventID: 'test3',
            isCategorical: false,
            isIndeterminate: false,
            isRevealed: true,
            isScalar: false,
            isUnethical: true,
            marketID: 'market3',
            maxValue: '2',
            minValue: '1',
            period: 19,
            reportHash: '0xtesthash123456789testhash3',
            reportedOutcomeID: 'testOutcomeID3',
            salt: 'salt3',
          }
        }
      },
      type: 'UPDATE_REPORTS'
    }];
    store.dispatch(action.revealReports());
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
  });
});
