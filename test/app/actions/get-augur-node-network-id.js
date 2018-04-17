import { getAugurNodeNetworkId, __RewireAPI__ } from 'modules/app/actions/get-augur-node-network-id'


import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('modules/app/actions/get-augur-node-network-id.js', () => {
  let store
  afterEach(() => {
    store.clearActions()
    __RewireAPI__.__ResetDependency__('augur')
  })
  const test = t => it(t.description, (done) => {
    store = configureMockStore([thunk])({ ...t.state })
    __RewireAPI__.__Rewire__('augur', t.stub.augur)
    store.dispatch(getAugurNodeNetworkId((err, augurNodeNetworkId) => {
      t.assertions(err, augurNodeNetworkId, store.getActions())
      done()
    }))
  })
  test({
    description: 'augur-node network id already in state',
    state: {
      connection: { augurNodeNetworkId: '4' },
    },
    stub: {
      augur: {
        augurNode: {
          getContractAddresses: () => assert.fail(),
        },
      },
    },
    assertions: (err, augurNodeNetworkId, actions) => {
      assert.isNull(err)
      assert.strictEqual(augurNodeNetworkId, '4')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'fetch network id from augur-node',
    state: {
      connection: { augurNodeNetworkId: null },
    },
    stub: {
      augur: {
        augurNode: {
          getContractAddresses: callback => callback(null, { net_version: '4' }),
        },
      },
    },
    assertions: (err, augurNodeNetworkId, actions) => {
      assert.isNull(err)
      assert.strictEqual(augurNodeNetworkId, '4')
      assert.deepEqual(actions, [{
        type: 'UPDATE_AUGUR_NODE_NETWORK_ID',
        augurNodeNetworkId: '4',
      }])
    },
  })
})
