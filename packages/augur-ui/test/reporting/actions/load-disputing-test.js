

import { stub } from 'sinon'
import configureMockStore from 'redux-mock-store'

import thunk from 'redux-thunk'

import { constants } from 'src/services/augurjs'

import { loadDisputing, __RewireAPI__ as loadDisputingRewire } from 'modules/reporting/actions/load-disputing'

describe('loadDisputing action', () => {
  const universeAddress = '1010101'

  const initialStoreState = {
    universe: {
      id: universeAddress,
    },
  }

  const expectedParams = {
    sortBy: 'endTime',
    universe: universeAddress,
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

    loadDisputingRewire.__Rewire__('augur', mockAugur)
    loadDisputingRewire.__Rewire__('loadMarketsInfoIfNotLoaded', () => () => {})
    loadDisputingRewire.__Rewire__('loadMarketsDisputeInfo', () => () => {})

    store = mockStore(initialStoreState)
  })

  afterEach(() => {
    loadDisputingRewire.__ResetDependency__('augur')
    loadDisputingRewire.__ResetDependency__('loadMarketsInfoIfNotLoaded')
    loadDisputingRewire.__ResetDependency__('loadMarketsDisputeInfo')
  })

  it('should load upcoming dispute markets for a given user in side the given universe', () => {
    store.dispatch(loadDisputing())

    const checkCall = (callIndex, method, reportingState, callbackArgs) => {
      const c = submitRequestStub.getCall(callIndex)
      assert.ok(c.calledWith(method, {
        reportingState,
        ...expectedParams,
      }))
      c.args[2](null, callbackArgs)
    }

    checkCall(0, 'getMarkets', constants.REPORTING_STATE.CROWDSOURCING_DISPUTE, [
      '1111',
    ])
    checkCall(1, 'getMarkets', constants.REPORTING_STATE.AWAITING_NEXT_WINDOW, [
      '2222',
      '3333',
    ])

    const actual = store.getActions()
    assert.lengthOf(actual, 2)
  })

  describe('upon error', () => {
    let callback
    let error

    beforeEach(() => {
      callback = stub()
      error = new Error('An Error Occurred')

      store.dispatch(loadDisputing(callback))
    })

    describe('CROWDSOURCING_DISPUTE', () => {
      it('should be passed to callback passed to action', () => {
        submitRequestStub.getCall(0).args[2](error)
        callback.calledWith(error)
      })
    })

    describe('AWAITING_NEXT_WINDOW', () => {
      it('should be passed to callback passed to action', () => {
        submitRequestStub.getCall(1).args[2](error)
        callback.calledWith(error)
      })
    })
  })
})
