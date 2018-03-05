import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import testState from 'test/testState'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { submitMarketContribute, __RewireAPI__ as submitMarketContributeReqireAPI } from 'modules/reporting/actions/submit-market-contribute'

describe(`modules/reporting/actions/submit-market-contribute.js`, () => {
  const state = Object.assign({}, testState)
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
    submitMarketContributeReqireAPI.__ResetDependency__('getPayoutNumerators')
  })

  const augurSuccess = {
    api: {
      Market: {
        contribute: (options) => {
          options.onSent()
          options.onSuccess()
        },
      },
    },
  }

  const augurFailed = {
    api: {
      Market: {
        contribute: (options) => {
          options.onSent()
          options.onFailed()
        },
      },
    },
  }

  const getPayoutNumerators = sinon.stub().returns([10000, 0])
  submitMarketContributeReqireAPI.__Rewire__('getPayoutNumerators', getPayoutNumerators)

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('history is called', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitMarketContribute('testMarketId', 0, false, 1000, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.calledOnce, `Didn't call 'history' once as expected`)
      },
    })
  })

  describe('null marketId', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitMarketContribute(null, 0, false, 1000, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.notCalled, `Did call 'history' not expected`)
      },
    })
  })

  describe('empty marketId', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
        store.dispatch(submitMarketContribute('', 0, false, 1000, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.notCalled, `Did call 'history' not expected`)
      },
    })
  })

  describe('non number outcome', () => {
    beforeEach(() => {
      submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
      store.dispatch(submitMarketContribute('testMarketId', 'blah', false, 1000, history, callback))
    })

    test({
      description: `should call callback`,
      assertions: () => {
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
      },
    })

    test({
      description: `should not call histor`,
      assertions: () => {
        assert(history.push.notCalled, `Did call 'history' not expected`)
      },
    })
  })

  describe('onFail from server', () => {
    test({
      description: `should call the expected method`,
      stub: sinon.stub().throws(),
      assertions: () => {
        submitMarketContributeReqireAPI.__Rewire__('augur', augurFailed)
        store.dispatch(submitMarketContribute('testMarketId', 0, false, 1000, history, callback))
        assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
        assert(history.push.calledOnce, `Did call 'history' not expected`)
      },
    })
  })
})
