import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import testState from 'test/testState'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { submitInitialReport, __RewireAPI__ as submitInitialReportReqireAPI } from 'modules/reporting/actions/submit-initial-report'

describe(`modules/reporting/actions/submit-initial-report.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const state = Object.assign({}, testState)
  const mockSelectMarket = {}
  mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testMarketId)
  const mockStore = configureMockStore([thunk])
  const store = mockStore(state)

  const callback = sinon.stub()
  const history = {
    push: sinon.stub(),
  }

  afterEach(() => {
    history.push.reset()
    callback.reset()
  })

  after(() => {
    submitInitialReportReqireAPI.__ResetDependency__('getPayoutNumerators')
  })

  const augurSuccess = {
    api: {
      Market: {
        doInitialReport: (options) => {
          options.onSent()
          options.onSuccess()
        },
      },
    },
  }

  const augurFailed = {
    api: {
      Market: {
        doInitialReport: (options) => {
          options.onSent()
          options.onFailed()
        },
      },
    },
  }

  const getPayoutNumerators = sinon.stub().returns([10000, 0])
  submitInitialReportReqireAPI.__Rewire__('getPayoutNumerators', getPayoutNumerators)
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('history is called', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitInitialReport('testMarketId', 0, false, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.calledOnce, `Didn't call 'history' once as expected`)
      },
    })
  })

  describe('null marketId', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitInitialReport(null, 0, false, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.notCalled, `Did call 'history' not expected`)
      },
    })
  })

  describe('empty marketId', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitInitialReport('', 0, false, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.notCalled, `Did call 'history' not expected`)
      },
    })
  })

  describe('non number outcome', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitInitialReport('testMarketId', 'blah', false, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.notCalled, `Did call 'history' not expected`)
      },
    })
  })

  describe('onFail from server', () => {
    test({
      description: `should call the expected method`,
      stub: sinon.stub().throws(),
      assertions: () => {
        submitInitialReportReqireAPI.__Rewire__('augur', augurFailed)
        store.dispatch(submitInitialReport('testMarketId', 0, false, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.calledOnce, `Did call 'history' not expected`)
      },
    })
  })
})
