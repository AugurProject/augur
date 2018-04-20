import sinon from 'sinon'
import testState from 'test/testState'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { submitInitialReport, __RewireAPI__ as submitInitialReportReqireAPI } from 'modules/reporting/actions/submit-initial-report'

describe(`modules/reporting/actions/submit-initial-report.js`, () => {
  const state = Object.assign({}, testState)
  const mockStore = configureMockStore([thunk])
  const store = mockStore(state)

  const callback = sinon.stub()
  const history = {
    push: sinon.stub(),
  }

  beforeEach(() => {
    history.push.reset()
    callback.reset()
  })

  after(() => {
    submitInitialReportReqireAPI.__ResetDependency__('getPayoutNumerators')
  })

  const augurSuccess = {
    constants: '0x5e3918',
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
    constants: '0x5e3918',
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


  it(`should call callback and history`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(false, 'testMarketId', 0, false, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.calledOnce, `Didn't call 'history' once as expected`)
  })

  it(`should call only callback`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(false, null, 0, false, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })


  it(`should call only callback with empty market id`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(false, '', 0, false, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })

  it(`should call only callback with empty market id and bad outcome`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(false, '', 'blah', false, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })

  it(`should only call callback with empty market id, bad outcome and is invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(false, '', 'blah', true, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })

  it(`should only call callback with bad outcome`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(false, 'testMarketId', 'blah', false, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })


  it(`should call both callback and history with good data not invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurFailed)
    store.dispatch(submitInitialReport(false, 'testMarketId', 0, false, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.calledOnce, `Did call 'history' not expected`)
  })

  it(`should call callback and history with good data and is invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurFailed)
    store.dispatch(submitInitialReport(false, 'testMarketId', 0, true, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.calledOnce, `Did call 'history' not expected`)
  })

  it(`should call callback and not history with good data and is invalid`, () => {
    submitInitialReportReqireAPI.__Rewire__('augur', augurSuccess)
    store.dispatch(submitInitialReport(true, 'testMarketId', 0, true, history, callback))
    assert(callback.calledOnce, `Didn't call 'callback' once as expected`)
    assert(history.push.notCalled, `Did call 'history' not expected`)
  })

})
