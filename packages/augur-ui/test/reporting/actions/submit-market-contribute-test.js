

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
    submitMarketContributeReqireAPI.__ResetDependency__('removeAccountDispute')
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
  const removeAccountDispute = sinon.stub().returns({ type: 'REMOVE_ACCOUNT_DISPUTE' })
  submitMarketContributeReqireAPI.__Rewire__('getPayoutNumerators', getPayoutNumerators)
  submitMarketContributeReqireAPI.__Rewire__('removeAccountDispute', removeAccountDispute)

  it(`should call callback and history with good data`, () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitMarketContribute(false, 'testMarketId', 0, false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.calledOnce, `Didn't call 'history' once as expected`)
  })

  it(`should call callback and history with good negative data`, () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitMarketContribute(false, 'testMarketId', -10, false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.calledOnce, `Didn't call 'history' once as expected`)
  })

  it(`should only call callback with null market id`, () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitMarketContribute(false, null, 0, false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })


  it(`should only callback with empty market id`, () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitMarketContribute(false, '', 0, false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })


  it('should only call callback with bad outcome', () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitMarketContribute(false, 'testMarketId', 'blah', false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })


  it(`should call both callback and history with good data`, () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurFailed)
    store.dispatch(submitMarketContribute(false, 'testMarketId', 0, false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.calledOnce, `Did call 'history' not expected`)
  })

  it(`should call callback but not history with good data`, () => {
    submitMarketContributeReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitMarketContribute(true, 'testMarketId', 0, false, 1000, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })
})
