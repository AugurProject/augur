import { describe, it, afterEach } from 'mocha'
import { assert } from 'chai'

import proxyquire from 'proxyquire'
import sinon from 'sinon'
import * as mockStore from 'test/mockStore'

import { abi } from 'services/augurjs'

describe('modules/my-markets/actions/load-market-creator-fees.js', () => {
  proxyquire.noPreserveCache().noCallThru()
  const { store } = mockStore.default

  const mockAugurJS = {
    augur: { api: { CompositeGetters: {} } },
    abi
  }
  mockAugurJS.augur.api.CompositeGetters.getMarketCreatorFeesCollected = sinon.stub().yields('10')

  const mockActions = {
    updateMarketCreatorFees: () => {}
  }
  sinon.stub(mockActions, 'updateMarketCreatorFees', marketFees => ({
    type: 'TESTING',
    data: marketFees
  }))

  const action = proxyquire('../../../src/modules/my-markets/actions/load-market-creator-fees', {
    './update-market-creator-fees': mockActions,
    '../../../services/augurjs': mockAugurJS
  })

  afterEach(() => {
    store.clearActions()
  })

  it(`should dispatch 'updateMarketCreatorFees' with the correct object`, () => {
    const out = [{
      type: 'TESTING',
      data: {
        '0x0000000000000000000000000000000000000001': abi.bignum('10')
      }
    }]
    store.dispatch(action.loadMarketCreatorFees('0x0000000000000000000000000000000000000001'))
    sinon.assert.calledOnce(mockAugurJS.augur.api.CompositeGetters.getMarketCreatorFeesCollected)
    sinon.assert.calledOnce(mockActions.updateMarketCreatorFees)
    assert.deepEqual(store.getActions(), out, `actions dispatched did not have the expected shape`)
  })
})
