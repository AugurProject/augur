import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import testState from 'test/testState'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { estimateSubmitInitialReport, __RewireAPI__ as estimateSubmitInitialReportReqireAPI } from 'modules/reporting/actions/estimate-submit-initial-report'

describe(`modules/reporting/actions/estimate-submit-initial-report.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const state = Object.assign({}, testState)
  const mockSelectMarket = {}
  mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testMarketId)
  const mockStore = configureMockStore([thunk])
  const store = mockStore(state)

  const augurSuccess = {
    constants: {
      DEFAULT_MAX_GAS: '0x0000',
    },
    api: {
      Market: {
        doInitialReport: (options) => {
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
        doInitialReport: (options) => {
          options.onFailed('Error')
        },
      },
    },
  }

  after(() => {
    estimateSubmitInitialReportReqireAPI.__ResetDependency__('augur')
  })

  it(`should call the expected method`, () => {
    estimateSubmitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(estimateSubmitInitialReport('', (value) => {
      assert.deepEqual(value, 'Market not found', `Didn't value as expected`)
    }))
  })


  it(`should get error back`, () => {
    estimateSubmitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(estimateSubmitInitialReport(null, (value) => {
      assert.deepEqual(value, 'Market not found', `Didn't value as expected`)
    }))
  })


  it(`should get gas cost value back`, () => {
    estimateSubmitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(estimateSubmitInitialReport('testMarketId', (err, value) => {
      assert.deepEqual(value, 'gasCostValue', `Didn't value as expected`)
    }))
  })


  it(`should get error from failed`, () => {
    estimateSubmitInitialReportReqireAPI.__Rewire__('augur', augurFailed)
    store.dispatch(estimateSubmitInitialReport('testMarketId', (value) => {
      assert.deepEqual(value, 'Error', `Didn't value as expected`)
    }))
  })

})
