import { describe, it } from 'mocha'
import { assert } from 'chai'

describe('modules/auth/actions/verify-matching-network-ids.js', () => {
  const { verifyMatchingNetworkIds, __RewireAPI__ } = require('modules/auth/actions/verify-matching-network-ids')
  const test = t => it(t.description, (done) => {
    __RewireAPI__.__Rewire__('isMetaMask', t.stub.isMetaMask)
    __RewireAPI__.__Rewire__('getAugurNodeNetworkId', t.stub.getAugurNodeNetworkId)
    __RewireAPI__.__Rewire__('getMetaMaskNetworkId', t.stub.getMetaMaskNetworkId)
    __RewireAPI__.__Rewire__('augur', t.stub.augur)
    verifyMatchingNetworkIds((err, isMatchingNetworkIds) => {
      t.assertions(err, isMatchingNetworkIds)
      done()
    })
  })
  test({
    description: 'using metamask, network ids all equal to 4',
    stub: {
      isMetaMask: () => true,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => '4',
      augur: { rpc: { getNetworkID: () => '4' } },
    },
    assertions: (err, isMatchingNetworkIds) => {
      assert.isNull(err)
      assert.isTrue(isMatchingNetworkIds)
    },
  })
  test({
    description: 'using metamask, metamask network id 1, others on 4',
    stub: {
      isMetaMask: () => true,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => '1',
      augur: { rpc: { getNetworkID: () => '4' } },
    },
    assertions: (err, isMatchingNetworkIds) => {
      assert.isNull(err)
      assert.isFalse(isMatchingNetworkIds)
    },
  })
  test({
    description: 'using metamask, middleware network id 1, others on 4',
    stub: {
      isMetaMask: () => true,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => '4',
      augur: { rpc: { getNetworkID: () => '1' } },
    },
    assertions: (err, isMatchingNetworkIds) => {
      assert.isNull(err)
      assert.isFalse(isMatchingNetworkIds)
    },
  })
  test({
    description: 'not using metamask, middleware and augur-node both on 4',
    stub: {
      isMetaMask: () => false,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => assert.fail(),
      augur: { rpc: { getNetworkID: () => '4' } },
    },
    assertions: (err, isMatchingNetworkIds) => {
      assert.isNull(err)
      assert.isTrue(isMatchingNetworkIds)
    },
  })
  test({
    description: 'not using metamask, middleware on 1, augur-node on 4',
    stub: {
      isMetaMask: () => false,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => assert.fail(),
      augur: { rpc: { getNetworkID: () => '1' } },
    },
    assertions: (err, isMatchingNetworkIds) => {
      assert.isNull(err)
      assert.isFalse(isMatchingNetworkIds)
    },
  })
  test({
    description: 'not using metamask, middleware network id not found, augur-node on 4',
    stub: {
      isMetaMask: () => false,
      getAugurNodeNetworkId: callback => callback(null, '4'),
      getMetaMaskNetworkId: () => assert.fail(),
      augur: { rpc: { getNetworkID: () => null } },
    },
    assertions: (err, isMatchingNetworkIds) => {
      assert.strictEqual(err, 'One or more network IDs not found: {"augurNode":"4","middleware":null}')
      assert.isUndefined(isMatchingNetworkIds)
    },
  })
})
