import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/reports/actions/submit-report.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      const AugurJS = {
        augur: {
          reporting: {
            submitReport: () => {},
            crypto: { makeHash: () => {} },
            format: { fixReport: () => {} }
          }
        }
      };
      const NextReportPage = {};
      const action = proxyquire('../../../src/modules/reports/actions/submit-report.js', {
        '../../../services/augurjs': AugurJS,
        './next-report-page': NextReportPage
      });
      AugurJS.augur.reporting.format.fixReport = sinon.stub().returns('0xde0b6b3a7640000');
      AugurJS.augur.reporting.crypto.makeHash = sinon.stub().returns('0xdeadbeef');
      sinon.stub(AugurJS.augur.reporting, 'submitReport', (o) => {
        store.dispatch({ type: 'AUGURJS_SUBMIT_REPORT', params: JSON.parse(JSON.stringify(o)) });
        o.onSuccess({ hash: '0xdeadbeef', callReturn: '1' });
      });
      NextReportPage.nextReportPage = sinon.stub().returns({ type: 'NEXT_REPORT_PAGE' });
      store.dispatch(action.submitReport(t.params.market, t.params.reportedOutcomeID, t.params.isIndeterminate));
      t.assertions(store.getActions());
      store.clearActions();
    });
  };
  test({
    description: 'report outcome 1 for binary event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'binary',
        description: 'Market 1'
      },
      reportedOutcomeID: '1',
      isIndeterminate: false
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          marketID: '0xa1',
          period: 7,
          reportedOutcomeID: '1',
          isCategorical: false,
          isScalar: false,
          isIndeterminate: false,
          isSubmitted: false,
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report outcome 2 for binary event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'binary',
        description: 'Market 1'
      },
      reportedOutcomeID: '2',
      isIndeterminate: false
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '2',
          isIndeterminate: false,
          isSubmitted: false,
          isCategorical: false,
          isScalar: false
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report outcome 5 for categorical event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'categorical',
        description: 'Market 1'
      },
      reportedOutcomeID: '5',
      isIndeterminate: false
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '5',
          isIndeterminate: false,
          isSubmitted: false,
          isCategorical: true,
          isScalar: false
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report outcome 1.2345 for scalar event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'scalar',
        description: 'Market 1'
      },
      reportedOutcomeID: '1.2345',
      isIndeterminate: false
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '1.2345',
          isIndeterminate: false,
          isSubmitted: false,
          isCategorical: false,
          isScalar: true
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report unethical outcome 1.2345 for scalar event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'scalar',
        description: 'Market 1'
      },
      reportedOutcomeID: '1.2345',
      isIndeterminate: false
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '1.2345',
          isIndeterminate: false,
          isSubmitted: false,
          isCategorical: false,
          isScalar: true
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report indeterminate for binary event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'binary',
        description: 'Market 1'
      },
      reportedOutcomeID: '1.5',
      isIndeterminate: true
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '1.5',
          isIndeterminate: true,
          isSubmitted: false,
          isCategorical: false,
          isScalar: false
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report indeterminate for categorical event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'categorical',
        description: 'Market 1'
      },
      reportedOutcomeID: '1.5',
      isIndeterminate: true
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '1.5',
          isIndeterminate: true,
          isSubmitted: false,
          isCategorical: true,
          isScalar: false
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
  test({
    description: 'report indeterminate for scalar event',
    params: {
      market: {
        id: '0xa1',
        eventID: '0xe1',
        type: 'scalar',
        description: 'Market 1'
      },
      reportedOutcomeID: '1.500000000000000001',
      isIndeterminate: true
    },
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0x0000000000000000000000000000000000000b0b'
      },
      reportCommitLock: {},
      reports: {}
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          eventID: '0xe1',
          period: 7,
          marketID: '0xa1',
          reportedOutcomeID: '1.500000000000000001',
          isIndeterminate: true,
          isSubmitted: false,
          isCategorical: false,
          isScalar: true
        }
      }, {
        type: 'AUGURJS_SUBMIT_REPORT',
        params: {
          event: '0xe1',
          report: 1,
          branch: '0xb1',
          period: 7
        }
      }, {
        type: 'UPDATE_REPORT',
        branchID: '0xb1',
        eventID: '0xe1',
        report: {
          isSubmitted: true
        }
      }, {
        type: 'NEXT_REPORT_PAGE'
      }]);
    }
  });
});
