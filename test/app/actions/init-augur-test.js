import { describe, it, beforeEach, afterEach } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import mocks from 'test/mockStore'

describe(`modules/app/actions/init-augur.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const { store } = mocks

  const mockAugurJS = {
    connect: () => {},
    augur: {
      loadBranch: () => {}
    }
  }
  const mockSetLoginAccount = {}
  const mockReportingTestSetup = {}
  const mockRegisterTransactionRelay = {}
  const mockLoadChatMessages = { loadChatMessages: () => {} }
  const mockLoadBranch = { loadBranch: () => {} }
  const mockUserLogin = sinon.stub().returns(false)

  mockLoadBranch.loadBranch = sinon.stub().returns({ type: 'LOAD_BRANCH' })
  mockLoadChatMessages.loadChatMessages = sinon.stub().returns({ type: 'LOAD_CHAT_MESSAGES' })

  sinon.stub(mockAugurJS, 'connect', (env, cb) => {
    console.log('in connect', env)
    cb(null, { contracts: {}, api: { functions: {}, events: {} } })
  })
  mockSetLoginAccount.setLoginAccount = sinon.stub().returns({
    type: 'SET_LOGIN_ACCOUNT'
  })
  mockLoadChatMessages.loadChatMessages = sinon.stub().returns({
    type: 'LOAD_CHAT_MESSAGES'
  })
  sinon.stub(mockAugurJS.augur, 'loadBranch', (branchID, cb) => {
    cb(null, 'testBranch')
  })
  mockReportingTestSetup.reportingTestSetup = sinon.stub().returns({
    type: 'REPORTING_TEST_SETUP'
  })
  mockRegisterTransactionRelay.registerTransactionRelay = sinon.stub().returns({
    type: 'REGISTER_TRANSACTION_RELAY'
  })

  const action = proxyquire('../../../src/modules/app/actions/init-augur.js', {
    '../../../services/augurjs': mockAugurJS,
    '../../auth/actions/set-login-account': mockSetLoginAccount,
    '../../reports/actions/reporting-test-setup': mockReportingTestSetup,
    '../../transactions/actions/register-transaction-relay': mockRegisterTransactionRelay,
    '../../chat/actions/load-chat-messages': mockLoadChatMessages,
    './load-branch': mockLoadBranch,
    '../../auth/helpers/is-user-logged-in': mockUserLogin
  })

  beforeEach(() => {
    store.clearActions()
    global.XMLHttpRequest = sinon.useFakeXMLHttpRequest()
    global.requests = []
    const requests = global.requests
    global.XMLHttpRequest.onCreate = (xhr) => {
      requests.push(xhr)
    }
  })

  afterEach(() => {
    global.XMLHttpRequest.restore()
    store.clearActions()
  })

  it(`should initiate the augur app`, () => {
    const out = [{ type: 'UPDATE_ENV', env: { reportingTest: false } }, {
      isConnected: true,
      type: 'UPDATE_CONNECTION_STATUS'
    }, {
      contractAddresses: {},
      type: 'UPDATE_CONTRACT_ADDRESSES'
    }, {
      functionsAPI: {},
      type: 'UPDATE_FUNCTIONS_API'
    }, {
      eventsAPI: {},
      type: 'UPDATE_EVENTS_API'
    }, {
      type: 'REGISTER_TRANSACTION_RELAY'
    }, {
      type: 'LOAD_CHAT_MESSAGES'
    }, {
      type: 'SET_LOGIN_ACCOUNT'
    }, {
      type: 'LOAD_BRANCH'
    }]

    store.dispatch(action.initAugur())

    global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reportingTest": false }`)

    assert(mockAugurJS.connect.calledOnce, `Didn't call AugurJS.connect() exactly once`)
    assert(mockRegisterTransactionRelay.registerTransactionRelay.calledOnce, `Didn't call registerTransactionRelay exactly once as expected`)
    assert(mockSetLoginAccount.setLoginAccount.calledOnce, `Didn't call setLoginAccount exactly once as expected`)
    assert(mockLoadChatMessages.loadChatMessages.calledOnce, `Didn't call loadChatMessages exactly once as expected`)
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`)
  })
})
