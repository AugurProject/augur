import { verifyMatchingNetworkIds, __RewireAPI__ } from 'modules/app/actions/verify-matching-network-ids'


import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe('modules/app/actions/verify-matching-network-ids.js', () => {
  const store = configureMockStore([thunk])({})
  afterEach(() => {
    store.clearActions()
    __RewireAPI__.__ResetDependency__('isGlobalWeb3')
    __RewireAPI__.__ResetDependency__('getAugurNodeNetworkId')
    __RewireAPI__.__ResetDependency__('getMetaMaskNetworkId')
    __RewireAPI__.__ResetDependency__('augur')
  })
  const test = t => it(t.description, (done) => {
    __RewireAPI__.__Rewire__('isGlobalWeb3', t.stub.isGlobalWeb3)
    __RewireAPI__.__Rewire__('getAugurNodeNetworkId', t.stub.getAugurNodeNetworkId)
    __RewireAPI__.__Rewire__('getMetaMaskNetworkId', t.stub.getMetaMaskNetworkId)
    __RewireAPI__.__Rewire__('augur', t.stub.augur)
    store.dispatch(verifyMatchingNetworkIds((err, expectedNetworkId) => {
      t.assertions(err, expectedNetworkId)
      done()
    }))
  })
  test({
    description: 'using global web3, network ids all equal to 4',
    stub: {
      isGlobalWeb3: () => true,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      augur: {
        rpc: {
          getNetworkID: () => '4',
          net: { version: callback => callback(null, '4') },
        },
      },
    },
    assertions: (err, expectedNetworkId) => {
      assert.isNull(err)
      assert.isUndefined(expectedNetworkId)
    },
  })
  test({
    description: 'using global web3, global web3 network id 1, others on 4',
    stub: {
      isGlobalWeb3: () => true,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      augur: {
        rpc: {
          getNetworkID: () => '4',
          net: { version: callback => callback(null, '1') },
        },
      },
    },
    assertions: (err, expectedNetworkId) => {
      assert.isNull(err)
      assert.strictEqual(expectedNetworkId, '4')
    },
  })
  test({
    description: 'using global web3, middleware network id 1, others on 4',
    stub: {
      isGlobalWeb3: () => true,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      augur: {
        rpc: {
          getNetworkID: () => '1',
          net: { version: callback => callback(null, '4') },
        },
      },
    },
    assertions: (err, expectedNetworkId) => {
      assert.isNull(err)
      assert.strictEqual(expectedNetworkId, '4')
    },
  })
  test({
    description: 'not using global web3, middleware and augur-node both on 4',
    stub: {
      isGlobalWeb3: () => false,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: assert.fail,
      augur: {
        rpc: {
          getNetworkID: () => '4',
          net: { version: assert.fail },
        },
      },
    },
    assertions: (err, expectedNetworkId) => {
      assert.isNull(err)
      assert.isUndefined(expectedNetworkId)
    },
  })
  test({
    description: 'not using global web3, middleware on 4, augur-node on 1',
    stub: {
      isGlobalWeb3: () => false,
      getAugurNodeNetworkId: callback => callback(null, '1'),
      getMetaMaskNetworkId: assert.fail,
      augur: {
        rpc: {
          getNetworkID: () => '4',
          net: { version: assert.fail },
        },
      },
    },
    assertions: (err, expectedNetworkId) => {
      assert.isNull(err)
      assert.strictEqual(expectedNetworkId, '1')
    },
  })
  test({
    description: 'not using global web3, middleware network id not found, augur-node on 4',
    stub: {
      isGlobalWeb3: () => false,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => assert.fail(),
      augur: {
        rpc: {
          getNetworkID: () => null,
          net: { version: assert.fail },
        },
      },
    },
    assertions: (err, expectedNetworkId) => {
      assert.strictEqual(err, 'One or more network IDs not found: {"augurNode":"4","middleware":null}')
      assert.isUndefined(expectedNetworkId)
    },
  })
})
