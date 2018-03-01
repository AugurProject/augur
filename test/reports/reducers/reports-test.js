import { describe, it, afterEach } from 'mocha'
import { assert } from 'chai'
import { UPDATE_REPORTS, CLEAR_REPORTS } from 'modules/reports/actions/update-reports'
import testState from 'test/testState'
import reducer from 'modules/reports/reducers/reports'

describe(`modules/reports/reducers/reports.js`, () => {
  let action
  let test
  const testStateReports = Object.assign({}, testState.reports[testState.universe.id])
  const state = Object.assign({}, testState)

  afterEach(() => {
    testState.reports[testState.universe.id] = Object.assign({}, testStateReports)
  })

  describe(`UPDATE_REPORTS`, () => {
    it('should update reports', () => {
      action = {
        type: UPDATE_REPORTS,
        reports: {
          [testState.universe.id]: {
            test: {
              marketId: 'test',
              example: 'example',
              isScalar: false,
              isIndeterminate: false,
            },
            example: {
              marketId: 'example',
              test: 'test',
              isScalar: false,
              isIndeterminate: false,
            },
          },
        },
      }
      const out = {
        [testState.universe.id]: {
          test: {
            marketId: 'test',
            example: 'example',
            isScalar: false,
            isIndeterminate: false,
          },
          example: {
            marketId: 'example',
            test: 'test',
            isScalar: false,
            isIndeterminate: false,
          },
          testMarketId: {
            marketId: 'testMarketId',
            isScalar: false,
            isSubmitted: false,
            isIndeterminate: false,
          },
        },
      }
      test = reducer(state.reports, action)
      assert.deepEqual(test, out, `Didn't update report information`)
    })
  })

  describe('UPDATE_REPORT', () => {
    const test = t => it(t.description, () => t.assertions(reducer(t.state.reports, {
      type: 'UPDATE_REPORT',
      universeId: t.params.universeId,
      marketId: t.params.marketId,
      report: t.params.report,
    })))
    test({
      description: 'no report data',
      params: {
        universeId: '0xb1',
        marketId: '0xe3',
        report: {},
      },
      state: {
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
            },
            '0xe3': {
              marketId: '0xe3',
            },
          },
        })
      },
    })
    test({
      description: 'insert new report',
      params: {
        universeId: '0xb1',
        marketId: '0xe3',
        report: {
          period: 7,
        },
      },
      state: {
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
            },
            '0xe3': {
              marketId: '0xe3',
              period: 7,
            },
          },
        })
      },
    })
    test({
      description: 'update existing report',
      params: {
        universeId: '0xb1',
        marketId: '0xe2',
        report: {
          period: 8,
          reportedOutcomeId: '2',
        },
      },
      state: {
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 8,
              reportedOutcomeId: '2',
            },
          },
        })
      },
    })
    test({
      description: 'insert first report on universe',
      params: {
        universeId: '0xb1',
        marketId: '0xe1',
        report: {
          period: 7,
        },
      },
      state: {
        reports: {},
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 7,
            },
          },
        })
      },
    })
  })

  describe('CLEAR_OLD_REPORTS', () => {
    const test = t => it(t.description, () => t.assertions(reducer(t.state.reports, {
      type: 'CLEAR_OLD_REPORTS',
      universeId: t.state.universe.id,
      currentReportingWindowAddress: t.state.universe.currentReportingWindowAddress,
    })))
    test({
      description: 'one old and one current report',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
    test({
      description: 'one old and one current report, both uncommitted',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
    test({
      description: 'one old and one current report, old report committed',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
    test({
      description: 'one old and one current report, old report committed and revealed',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
    test({
      description: 'two old reports',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 6,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {},
        })
      },
    })
    test({
      description: 'two current reports',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
    test({
      description: 'two current reports and two old reports',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 6,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe3': {
              marketId: '0xe3',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe4': {
              marketId: '0xe4',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe3': {
              marketId: '0xe3',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe4': {
              marketId: '0xe4',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
    test({
      description: 'two current reports and two old reports on universe 1, one current report and three old reports on universe 2',
      state: {
        universe: {
          id: '0xb1',
          currentReportingWindowAddress: 7,
        },
        reports: {
          '0xb1': {
            '0xe1': {
              marketId: '0xe1',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe2': {
              marketId: '0xe2',
              period: 6,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe3': {
              marketId: '0xe3',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe4': {
              marketId: '0xe4',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
          '0xb2': {
            '0xe5': {
              marketId: '0xe5',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe6': {
              marketId: '0xe6',
              period: 6,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe7': {
              marketId: '0xe7',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe8': {
              marketId: '0xe8',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        },
      },
      assertions: (reduced) => {
        assert.deepEqual(reduced, {
          '0xb1': {
            '0xe3': {
              marketId: '0xe3',
              period: 7,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe4': {
              marketId: '0xe4',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
          '0xb2': {
            '0xe5': {
              marketId: '0xe5',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe6': {
              marketId: '0xe6',
              period: 6,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe7': {
              marketId: '0xe7',
              period: 6,
              reportedOutcomeId: '2',
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
            '0xe8': {
              marketId: '0xe8',
              period: 7,
              reportedOutcomeId: null,
              isScalar: false,
              isCategorical: false,
              isIndeterminate: false,
            },
          },
        })
      },
    })
  })

  describe(`CLEAR_REPORTS`, () => {
    it('should clear all reports', () => {
      action = {
        type: CLEAR_REPORTS,
      }
      const fakeState = {
        [testState.universe.id]: {
          test: {
            marketId: 'test',
            example: 'example',
            isScalar: false,
            isIndeterminate: false,
          },
          example: {
            marketId: 'example',
            test: 'test',
            isScalar: false,
            isIndeterminate: false,
          },
        },
      }
      test = reducer(fakeState, action)
      assert.deepEqual(test, {}, `Didn't clear reports correctly`)
    })
  })
})
