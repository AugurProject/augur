

import proxyquire from 'proxyquire'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/universe/actions/update-universe.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = Object.assign({}, testState)
  const store = mockStore(state)
  const action = proxyquire('../../../src/modules/universe/actions/update-universe.js', {})
  it('should dispatch UPDATE_UNIVERSE action', () => {
    store.dispatch(action.updateUniverse({
      currentPeriod: 20,
      currentPeriodProgress: 52,
      isReportRevealPhase: true,
      reportPeriod: 18,
      periodLength: 900,
    }))
    assert.deepEqual(store.getActions(), [{
      type: 'UPDATE_UNIVERSE',
      universe: {
        currentPeriod: 20,
        currentPeriodProgress: 52,
        isReportRevealPhase: true,
        reportPeriod: 18,
        periodLength: 900,
      },
    }])
    store.clearActions()
  })
})
