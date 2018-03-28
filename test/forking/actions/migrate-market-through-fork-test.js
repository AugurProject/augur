import { describe, it } from 'mocha'
import { assert } from 'chai'

import { migrateMarketThroughFork, __RewireAPI__ as ReWireModule } from 'modules/forking/actions/migrate-market-through-fork'

describe('modules/forking/actions/migrate-market-through-fork.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('migrateMarketThroughFork', () => {
    test({
      description: 'should call the function as expected',
      assertions: () => {
        const stateData = {
          loginAccount: {
            meta: 'META',
          },
        }

        const getState = () => stateData

        ReWireModule.__Rewire__('augur', {
          api: {
            Market: {
              migrateThroughOneFork: (args) => {
                assert.deepEqual(args.tx, {
                  to: '0xMARKET',
                  estimateGas: false,
                  meta: 'META',
                })
                return args.onSuccess(null)
              },
            },
          },
        })

        migrateMarketThroughFork('0xMARKET', false, () => {})(() => {}, getState)
      },
    })
  })
})
