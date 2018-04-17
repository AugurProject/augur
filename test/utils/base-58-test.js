

import proxyquire from 'proxyquire'

describe(`utils/base-58.js`, () => {
  proxyquire.noPreserveCache()
  const base58 = proxyquire('../../src/utils/base-58.js', {})
  describe('base58Decode', () => {
    const test = t => it(JSON.stringify(t), () => {
      const decoded = base58.base58Decode(t.encoded)
      t.assertions(decoded)
    })
    test({
      encoded: 'kpXKnbi9Czht5bSPbpf7QoYiDWDF8UWZzmWiCrM7xoE4rbkZ7WmpM4dq9WLki1F8Qhg4bcBYtE8',
      assertions: (decoded) => {
        assert.deepEqual(decoded, {
          hello: 'world',
          description: 'this is a test object',
        })
      },
    })
  })
  describe('base58Encode', () => {
    const test = t => it(JSON.stringify(t), () => {
      const encoded = base58.base58Encode(t.object)
      t.assertions(encoded)
    })
    test({
      object: {
        hello: 'world',
        description: 'this is a test object',
      },
      assertions: (encoded) => {
        assert.deepEqual(encoded, 'kpXKnbi9Czht5bSPbpf7QoYiDWDF8UWZzmWiCrM7xoE4rbkZ7WmpM4dq9WLki1F8Qhg4bcBYtE8')
      },
    })
  })
})
