import { describe, it, afterEach } from 'mocha'

import testState from 'test/testState'
import reducer from 'modules/reports/reducers/reports'

describe(`modules/reports/reducers/reports.js`, () => {
  const testStateReports = Object.assign({}, testState.reports[testState.universe.id])
  const state = Object.assign({}, testState)

  afterEach(() => {
    testState.reports[testState.universe.id] = Object.assign({}, testStateReports)
  })

  describe(`UPDATE_REPORTS`, () => {
    it('should update reports', () => {
      assert.deepEqual(reducer(state.reports, {
        type: 'UPDATE_REPORTS',
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
      }), {
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
      }, `Didn't update report information`)
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
})
