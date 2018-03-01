import { describe, it } from 'mocha'
import { assert } from 'chai'

import { stub } from 'sinon'
import configureMockStore from 'redux-mock-store'

import thunk from 'redux-thunk'

import { constants } from 'src/services/augurjs'

import { loadReporting, __RewireAPI__ as loadReportingRewire } from './load-reporting'

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

  const expectedParams = {
    sortBy: 'endDate',
    universe: universeAddress,
    designatedReporter: loginAccountAddress,
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
    loadReportingRewire.__Rewire__('loadMarketsInfo', () => () => {})

    store = mockStore(initialStoreState)
  })

  afterEach(() => {
    loadReportingRewire.__ResetDependency__('augur')
    loadReportingRewire.__ResetDependency__('loadMarketsInfo')
  })

  it('should load upcoming designated markets for a given user in side the given universe', () => {
    store.dispatch(loadReporting())

    const checkCall = (callIndex, method, reportingState, callbackArgs) => {
      const c = submitRequestStub.getCall(callIndex)
      assert.ok(c.calledWith(method, {
        reportingState,
        ...expectedParams,
      }))
      c.args[2](null, callbackArgs)
    }

    checkCall(0, 'getMarkets', constants.REPORTING_STATE.PRE_REPORTING, [
      '1111',
    ])
    checkCall(1, 'getMarkets', constants.REPORTING_STATE.DESIGNATED_REPORTING, [
      '2222',
      '3333',
    ])

    checkCall(2, 'getMarkets', constants.REPORTING_STATE.OPEN_REPORTING, [
      '4444',
    ])

    const actual = store.getActions()
    assert.lengthOf(actual, 3)
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
