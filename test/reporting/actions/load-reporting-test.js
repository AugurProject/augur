

import { stub } from 'sinon'
import configureMockStore from 'redux-mock-store'

import thunk from 'redux-thunk'

import { constants } from 'src/services/augurjs'

import { loadReporting, __RewireAPI__ as loadReportingRewire } from 'modules/reporting/actions/load-reporting'

describe('loadReporting action', () => {
  const loginAccountAddress = '22222222'
  const universeAddress = '1010101'

  const initialStoreState = {
    universe: {
      id: universeAddress,
    },
    loginAccount: {
      address: loginAccountAddress,
    },
  }

  let mockAugur
  let mockStore
  let store
  let submitRequestStub

  before(() => {
    mockStore = configureMockStore([thunk])
  })

  beforeEach(() => {
    mockAugur = {
      augurNode: {
        submitRequest: () => {},
      },
    }

    submitRequestStub = stub(mockAugur.augurNode, 'submitRequest')

    loadReportingRewire.__Rewire__('augur', mockAugur)
    loadReportingRewire.__Rewire__('loadMarketsInfoIfNotLoaded', (marketIds, callback) => {
      callback(null)
      return {
        type: 'LOAD_MARKETS_INFO_IF_NOT_LOADED',
        data: {
          marketIds,
        },
      }
    })

    store = mockStore(initialStoreState)
  })

  afterEach(() => {
    loadReportingRewire.__ResetDependency__('augur')
    loadReportingRewire.__ResetDependency__('loadMarketsInfoIfNotLoaded')
  })

  it('should load upcoming designated markets for a given user in side the given universe', () => {
    store.dispatch(loadReporting())

    const checkCall = (callIndex, method, reportingState, expectedParams, callbackArgs) => {
      const c = submitRequestStub.getCall(callIndex)
      assert.ok(c.calledWith(method, {
        reportingState,
        ...expectedParams,
      }))
      c.args[2](null, callbackArgs)
    }

    checkCall(0, 'getMarkets', constants.REPORTING_STATE.PRE_REPORTING, {
      sortBy: 'endTime',
      universe: universeAddress,
      designatedReporter: loginAccountAddress,
    }, [
      '1111',
    ])
    checkCall(1, 'getMarkets', constants.REPORTING_STATE.DESIGNATED_REPORTING, {
      sortBy: 'endTime',
      universe: universeAddress,
      designatedReporter: loginAccountAddress,
    }, [
      '2222',
      '3333',
    ])

    checkCall(2, 'getMarkets', constants.REPORTING_STATE.OPEN_REPORTING, {
      sortBy: 'endTime',
      universe: universeAddress,
    }, [
      '4444',
    ])

    const expected = [
      {
        data: [
          '1111',
        ],
        type: 'UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS',
      },
      {
        data: {
          marketIds: [
            '1111',
          ],
        },
        type: 'LOAD_MARKETS_INFO_IF_NOT_LOADED',
      },
      {
        data: [
          '2222',
          '3333',
        ],
        type: 'UPDATE_DESIGNATED_REPORTING_MARKETS',
      },
      {
        data: {
          marketIds: [
            '2222',
            '3333',
          ],
        },
        type: 'LOAD_MARKETS_INFO_IF_NOT_LOADED',
      },
      {
        data: [
          '4444',
        ],
        type: 'UPDATE_OPEN_REPORTING_MARKETS',
      },
      {
        data: {
          marketIds: [
            '4444',
          ],
        },
        type: 'LOAD_MARKETS_INFO_IF_NOT_LOADED',
      },
    ]
    const actual = store.getActions()
    // actions include load market info actions
    assert.lengthOf(actual, 6)
    assert.deepEqual(actual, expected, 'Did not get correct actions')
  })

  describe('upon error', () => {
    let callback
    let error

    beforeEach(() => {
      callback = stub()
      error = new Error('An Error Occurred')

      store.dispatch(loadReporting(callback))
    })

    it('should be passed to callback passed to action', () => {
      submitRequestStub.getCall(0).args[2](error)

      callback.calledWith(error)
    })
  })
})
