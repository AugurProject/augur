import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe('modules/reports/actions/load-report-descriptors.js', () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, (done) => {
      const store = mockStore(t.state);
      const action = proxyquire('../../../src/modules/reports/actions/load-report-descriptors', {});
      store.dispatch(action.loadReportDescriptors((err) => {
        assert.isNull(err);
        t.assertions(store.getActions());
        store.clearActions();
        done();
      }));
    });
  };
  test({
    description: 'binary market, not indeterminate',
    eventID: '0xe1',
    marketID: '0xa1',
    state: {
      branch: {
        id: '0xb1',
        description: 'Branch 1',
        periodLength: 200,
        currentPeriod: 8,
        reportPeriod: 7,
        currentPeriodProgress: 10
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b',
        ether: '10000',
        realEther: '2.5',
        rep: '47'
      },
      marketsData: {
        '0xa1': {
          type: 'binary',
          minValue: '1',
          maxValue: '2'
        }
      },
      reports: {
        '0xb1': {
          '0xe1': {
            eventID: '0xe1',
            period: 7,
            marketID: '0xa1',
            reportedOutcomeID: '1',
            isIndeterminate: false,
            isSubmitted: false
          }
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORTS',
        reports: {
          '0xb1': {
            '0xe1': {
              eventID: '0xe1',
              period: 7,
              marketID: '0xa1',
              reportedOutcomeID: '1',
              minValue: '1',
              maxValue: '2',
              isCategorical: false,
              isScalar: false,
              isIndeterminate: false,
              isSubmitted: false
            }
          }
        }
      }]);
    }
  });
  test({
    description: 'categorical market, not indeterminate',
    eventID: '0xe1',
    marketID: '0xa1',
    state: {
      branch: {
        id: '0xb1',
        description: 'Branch 1',
        periodLength: 200,
        currentPeriod: 8,
        reportPeriod: 7,
        currentPeriodProgress: 10
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b',
        ether: '10000',
        realEther: '2.5',
        rep: '47'
      },
      marketsData: {
        '0xa1': {
          type: 'categorical',
          minValue: '1',
          maxValue: '5'
        }
      },
      reports: {
        '0xb1': {
          '0xe1': {
            eventID: '0xe1',
            period: 7,
            marketID: '0xa1',
            reportedOutcomeID: '1',
            isIndeterminate: false,
            isSubmitted: false
          }
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORTS',
        reports: {
          '0xb1': {
            '0xe1': {
              eventID: '0xe1',
              period: 7,
              marketID: '0xa1',
              reportedOutcomeID: '1',
              minValue: '1',
              maxValue: '5',
              isCategorical: true,
              isScalar: false,
              isIndeterminate: false,
              isSubmitted: false
            }
          }
        }
      }]);
    }
  });
  test({
    description: 'categorical market, indeterminate',
    eventID: '0xe1',
    marketID: '0xa1',
    state: {
      branch: {
        id: '0xb1',
        description: 'Branch 1',
        periodLength: 200,
        currentPeriod: 8,
        reportPeriod: 7,
        currentPeriodProgress: 10
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b',
        ether: '10000',
        realEther: '2.5',
        rep: '47'
      },
      marketsData: {
        '0xa1': {
          type: 'categorical',
          minValue: '1',
          maxValue: '5'
        }
      },
      reports: {
        '0xb1': {
          '0xe1': {
            eventID: '0xe1',
            period: 7,
            marketID: '0xa1',
            reportedOutcomeID: '0.5',
            isSubmitted: false
          }
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORTS',
        reports: {
          '0xb1': {
            '0xe1': {
              eventID: '0xe1',
              period: 7,
              marketID: '0xa1',
              reportedOutcomeID: '0.5',
              minValue: '1',
              maxValue: '5',
              isCategorical: true,
              isScalar: false,
              isIndeterminate: true,
              isSubmitted: false
            }
          }
        }
      }]);
    }
  });
  test({
    description: 'scalar market, indeterminate',
    eventID: '0xe1',
    marketID: '0xa1',
    state: {
      branch: {
        id: '0xb1',
        description: 'Branch 1',
        periodLength: 200,
        currentPeriod: 8,
        reportPeriod: 7,
        currentPeriodProgress: 10
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b',
        ether: '10000',
        realEther: '2.5',
        rep: '47'
      },
      marketsData: {
        '0xa1': {
          type: 'scalar',
          minValue: '5',
          maxValue: '20'
        }
      },
      reports: {
        '0xb1': {
          '0xe1': {
            eventID: '0xe1',
            period: 7,
            marketID: '0xa1',
            reportedOutcomeID: '1.500000000000000001',
            isSubmitted: false
          }
        }
      }
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORTS',
        reports: {
          '0xb1': {
            '0xe1': {
              eventID: '0xe1',
              period: 7,
              marketID: '0xa1',
              reportedOutcomeID: '1.500000000000000001',
              minValue: '5',
              maxValue: '20',
              isCategorical: false,
              isScalar: true,
              isIndeterminate: false,
              isSubmitted: false
            }
          }
        }
      }]);
    }
  });
});
