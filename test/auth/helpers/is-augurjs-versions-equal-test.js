import isAugurJSVersionsEqual, { __RewireAPI__ as isAugurJSVersionsEqualAPI } from 'modules/auth/helpers/is-augurjs-versions-equal'

describe('modules/auth/helpers/is-augurjs-versions-equal', () => {
  const test = t => it(t.description, async () => t.assertions())

  afterEach(() => {
    isAugurJSVersionsEqualAPI.__ResetDependency__('augur')
  })

  test({
    description: `Should handle an error from augurNode.getContractAddresses, and return false`,
    assertions: () => {
      isAugurJSVersionsEqualAPI.__Rewire__('augur', {
        version: 'helloWorld',
        augurNode: {
          getContractAddresses: (cb) => {
            cb({ error: 1000, message: 'Uh-Oh!' })
          },
        },
      })

      return isAugurJSVersionsEqual().then((res) => {
        assert.isObject(res)
        assert.isFalse(res.isEqual)
        assert.isUndefined(res.augurNode)
        assert.deepEqual(res.augurjs, 'helloWorld')
      })
    },
  })

  test({
    description: `Should handle a versionMismatch and return false`,
    assertions: () => {
      isAugurJSVersionsEqualAPI.__Rewire__('augur', {
        version: 'helloWorld',
        augurNode: {
          getContractAddresses: (cb) => {
            cb(undefined, { version: 'goodbyeWorld' })
          },
        },
      })

      return isAugurJSVersionsEqual().then((res) => {
        assert.isObject(res)
        assert.isFalse(res.isEqual)
        assert.deepEqual(res.augurNode, 'goodbyeWorld')
        assert.deepEqual(res.augurjs, 'helloWorld')
      })
    },
  })

  test({
    description: `Should handle a matching version and return true`,
    assertions: () => {
      isAugurJSVersionsEqualAPI.__Rewire__('augur', {
        version: 'helloWorld',
        augurNode: {
          getContractAddresses: (cb) => {
            cb(undefined, { version: 'helloWorld' })
          },
        },
      })
      return isAugurJSVersionsEqual().then((res) => {
        assert.isObject(res)
        assert.isTrue(res.isEqual)
        assert.deepEqual(res.augurNode, 'helloWorld')
        assert.deepEqual(res.augurjs, 'helloWorld')
      })
    },
  })
})
