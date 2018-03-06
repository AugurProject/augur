import { describe, it } from 'mocha'
import { assert } from 'chai'
import testState from 'test/testState'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { estimateSubmitMarketContribute, __RewireAPI__ as estimateSubmitMarketContributeReqireAPI } from 'modules/reporting/actions/estimate-submit-market-contribute'

describe(`modules/reporting/actions/estimate-submit-market-contribute.js`, () => {
  const state = Object.assign({}, testState)
  const mockStore = configureMockStore([thunk])
  const store = mockStore(state)

  const augurSuccess = {
    constants: {
      DEFAULT_MAX_GAS: '0x0000',
    },
    api: {
      Market: {
        contribute: (options) => {
          options.onSuccess('gasCostValue')
        },
      },
    },
  }

  const augurFailed = {
    constants: {
      DEFAULT_MAX_GAS: '0x0000',
    },
    api: {
      Market: {
        contribute: (options) => {
          options.onFailed('Error')
        },
      },
    },
  }

  after(() => {
    estimateSubmitMarketContributeReqireAPI.__ResetDependency__('augur')
  })

  it(`should call the expected method`, () => {
    estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(estimateSubmitMarketContribute('', 1000, (value) => {
      assert.deepEqual(value, 'Market not found', `Didn't value as expected`)
    }))
  })


  it(`should call the expected method`, () => {
    estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(estimateSubmitMarketContribute(null, 1000, (value) => {
      assert.deepEqual(value, 'Market not found', `Didn't value as expected`)
    }))
  })

  it(`should call the expected method`, () => {
    estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(estimateSubmitMarketContribute('testMarketId', 1000, (err, value) => {
      assert.deepEqual(value, 'gasCostValue', `Didn't value as expected`)
    }))
  })


  it(`should call the expected method`, () => {
    estimateSubmitMarketContributeReqireAPI.__Rewire__('augur', augurFailed)
    store.dispatch(estimateSubmitMarketContribute('testMarketId', 1000, (value) => {
      assert.deepEqual(value, 'Error', `Didn't value as expected`)
    }))
  })

})
