import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import { UPDATE_REPORTS, CLEAR_REPORTS } from 'modules/reports/actions/update-reports';
import testState from 'test/testState';
import reducer from 'modules/reports/reducers/reports';

describe(`modules/reports/reducers/reports.js`, () => {
  let action;
  let test;
  const testStateReports = Object.assign({}, testState.reports[testState.branch.id]);
  const state = Object.assign({}, testState);

  afterEach(() => {
    testState.reports[testState.branch.id] = Object.assign({}, testStateReports);
  });

  describe(`UPDATE_REPORTS`, () => {
    it('should update reports', () => {
      action = {
        type: UPDATE_REPORTS,
        reports: {
          [testState.branch.id]: {
            test: {
              marketID: 'test',
              example: 'example',
              isScalar: false,
              isIndeterminate: false
            },
            example: {
              marketID: 'example',
              test: 'test',
              isScalar: false,
              isIndeterminate: false
            }
          }
        }
      };
      const out = {
        [testState.branch.id]: {
          test: {
            marketID: 'test',
            example: 'example',
            isScalar: false,
            isIndeterminate: false
          },
          example: {
            marketID: 'example',
            test: 'test',
            isScalar: false,
            isIndeterminate: false
          },
          testMarketID: {
            marketID: 'testMarketID',
            isScalar: false,
            isSubmitted: false,
            isIndeterminate: false
          }
        }
      };
      test = reducer(state.reports, action);
      assert.deepEqual(test, out, `Didn't update report information`);
    });
  });

  describe('UPDATE_REPORT', () => {
    const test = t => it(t.description, () => t.assertions(reducer(t.state.reports, {
      type: 'UPDATE_REPORT',
      branchID: t.params.branchID,
      marketID: t.params.marketID,
      report: t.params.report
    })));
    test({
      description: 'no report data',
      params: {
        branchID: '0xb1',
        marketID: '0xe3',
        report: {}
      },
      state: {
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7
            },
            '0xe3': {
              marketID: '0xe3'
            }
          }
        });
      }
    });
    test({
      description: 'insert new report',
      params: {
        branchID: '0xb1',
        marketID: '0xe3',
        report: {
          period: 7
        }
      },
      state: {
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7
            },
            '0xe3': {
              marketID: '0xe3',
              period: 7
            }
          }
        });
      }
    });
    test({
      description: 'update existing report',
      params: {
        branchID: '0xb1',
        marketID: '0xe2',
        report: {
          period: 8,
          reportedOutcomeID: '2'
        }
      },
      state: {
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6
            },
            '0xe2': {
              marketID: '0xe2',
              period: 8,
              reportedOutcomeID: '2'
            }
          }
        });
      }
    });
    test({
      description: 'insert first report on branch',
      params: {
        branchID: '0xb1',
        marketID: '0xe1',
        report: {
          period: 7
        }
      },
      state: {
        reports: {}
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 7
            }
          }
        });
      }
    });
  });

  describe('CLEAR_OLD_REPORTS', () => {
    const test = t => it(t.description, () => t.assertions(reducer(t.state.reports, {
      type: 'CLEAR_OLD_REPORTS',
      branchID: t.state.branch.id,
      currentReportingWindowAddress: t.state.branch.currentReportingWindowAddress
    })));
    test({
      description: 'one old and one current report',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
    test({
      description: 'one old and one current report, both uncommitted',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
    test({
      description: 'one old and one current report, old report committed',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
    test({
      description: 'one old and one current report, old report committed and revealed',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
    test({
      description: 'two old reports',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 6,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {}
        });
      }
    });
    test({
      description: 'two current reports',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
    test({
      description: 'two current reports and two old reports',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 6,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe3': {
              marketID: '0xe3',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe4': {
              marketID: '0xe4',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe3': {
              marketID: '0xe3',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe4': {
              marketID: '0xe4',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
    test({
      description: 'two current reports and two old reports on branch 1, one current report and three old reports on branch 2',
      state: {
        branch: {
          id: '0xb1',
          currentReportingWindowAddress: 7
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketID: '0xe1',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe2': {
              marketID: '0xe2',
              period: 6,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe3': {
              marketID: '0xe3',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe4': {
              marketID: '0xe4',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          },
          '0xb2': {
            '0xe5': {
              marketID: '0xe5',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe6': {
              marketID: '0xe6',
              period: 6,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe7': {
              marketID: '0xe7',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe8': {
              marketID: '0xe8',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        }
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe3': {
              marketID: '0xe3',
              period: 7,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe4': {
              marketID: '0xe4',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          },
          '0xb2': {
            '0xe5': {
              marketID: '0xe5',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe6': {
              marketID: '0xe6',
              period: 6,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe7': {
              marketID: '0xe7',
              period: 6,
              reportedOutcomeID: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            },
            '0xe8': {
              marketID: '0xe8',
              period: 7,
              reportedOutcomeID: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false
            }
          }
        });
      }
    });
  });

  describe(`CLEAR_REPORTS`, () => {
    it('should clear all reports', () => {
      action = {
        type: CLEAR_REPORTS
      };
      const fakeState = {
        [testState.branch.id]: {
          test: {
            marketID: 'test',
            example: 'example',
            isScalar: false,
            isIndeterminate: false
          },
          example: {
            marketID: 'example',
            test: 'test',
            isScalar: false,
            isIndeterminate: false
          }
        }
      };
      test = reducer(fakeState, action);
      assert.deepEqual(test, {}, `Didn't clear reports correctly`);
    });
  });
});
