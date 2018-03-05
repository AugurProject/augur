import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import testState from 'test/testState'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { estimateSubmitMarketContribute, __RewireAPI__ as estimateSubmitMarketContributeReqireAPI } from 'modules/reporting/actions/estimate-submit-market-contribute'

describe(`modules/reporting/actions/estimate-submit-market-contribute.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const state = Object.assign({}, testState)
  const mockSelectMarket = {}
  mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testMarketId)
  const mockStore = configureMockStore([thunk])
  const store = mockStore(state)

  const augurSuccess = {
    api: {
      Market: {
        contribute: (options) => {
          options.onSuccess('gasCostValue')
        },
      },
    },
  }

  const augurFailed = {
    api: {
      Market: {
        contribute: (options) => {
          options.onFailed('Error')
        },
      },
    },
  }

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  after(() => {
    estimateSubmitMarketContributeReqireAPI.__ResetDependency__('augur')
  })

  describe('empty marketId', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(estimateSubmitMarketContribute('', 1000, (value) => {
          assert.deepEqual(value, 'Market not found', `Didn't value as expected`)
        }))
      },
    })
  })

  describe('null marketId', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(estimateSubmitMarketContribute(null, 1000, (value) => {
          assert.deepEqual(value, 'Market not found', `Didn't value as expected`)
        }))
      },
    })
  })

  describe('success call', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(estimateSubmitMarketContribute('testMarketId', 1000, (err, value) => {
          assert.deepEqual(value, 'gasCostValue', `Didn't value as expected`)
        }))
      },
    })
  })

  describe('failed called', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurFailed)
        store.dispatch(estimateSubmitMarketContribute('testMarketId', 1000, (value) => {
          assert.deepEqual(value, 'Error', `Didn't value as expected`)
        }))
      },
    })
  })
})
