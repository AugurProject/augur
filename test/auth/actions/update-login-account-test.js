

import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'

describe(`modules/auth/actions/update-login-account.js`, () => {
  proxyquire.noPreserveCache()
  const mockStore = configureMockStore([thunk])
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const UpdateFromAddress = { updateFromAddress: () => {} }
      const action = proxyquire('../../../src/modules/auth/actions/update-login-account.js', {
        '../../contracts/actions/update-contract-api': UpdateFromAddress,
      })
      sinon.stub(UpdateFromAddress, 'updateFromAddress').callsFake(address => ({ type: 'UPDATE_FROM_ADDRESS', address }))
      store.dispatch(action[t.method](t.param))
      t.assertions(store.getActions())
      store.clearActions()
    })
  }
  test({
    description: 'should fire a UPDATE_LOGIN_ACCOUNT action type with data',
    state: {},
    method: 'updateLoginAccount',
    param: { address: '0xb0b' },
    assertions: (actions) => {
      const output = [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          address: '0xb0b',
        },
      }, {
        type: 'UPDATE_FROM_ADDRESS',
        address: '0xb0b',
      }]
      assert.deepEqual(actions, output, `The action fired incorrectly`)
    },
  })
  test({
    description: 'should fire a CLEAR_LOGIN_ACCOUNT action type',
    state: {},
    method: 'clearLoginAccount',
    param: { address: '0xb0b' },
    assertions: (actions) => {
      const output = [{
        type: 'CLEAR_LOGIN_ACCOUNT',
      }]
      assert.deepEqual(actions, output, `The action fired incorrectly`)
    },
  })
})
