import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe(`modules/reports/actions/clear-old-reports.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const action = proxyquire('../../../src/modules/reports/actions/clear-old-reports.js', {})
      store.dispatch(action.clearOldReports())
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'should clear old reports',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLEAR_OLD_REPORTS',
        universeId: '0xb1',
        currentReportingWindowAddress: 7,
      }])
    },
  })
})
