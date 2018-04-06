import { describe, it } from 'mocha'
import { assert } from 'chai'

import { BINARY } from 'modules/markets/constants/market-types'
import { estimateSubmitMigrateREP, __RewireAPI__ as ReWireModule } from 'modules/forking/actions/estimate-submit-migrate-rep'

describe('modules/forking/actions/estimate-submit-migrate-rep.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('estimateSubmitMigrateREP', () => {
    test({
      description: 'should call the function as expected',
      assertions: () => {
        const stateData = {
          loginAccount: {
            meta: 'META',
          },
          universe: {
            id: '0xUNIVERSE',
          },
          marketsData: {
            '0xMARKET': {
              maxPrice: 1,
              minPrice: 0,
              numTicks: 10000,
              marketType: BINARY,
            },
          },
        }

        const getState = () => stateData

        ReWireModule.__Rewire__('augur', {
          constants: {
            DEFAULT_MAX_GAS: 600000,
          },
          api: {
            Universe: {
              getReputationToken: (args, callback) => {
                assert.deepEqual(args, {
                  tx: { to: '0xUNIVERSE' },
                })
                return callback(null, '0xREP_TOKEN')
              },
            },
            ReputationToken: {
              migrateOutByPayout: (args) => {
                assert.deepEqual(args.tx, { to: '0xREP_TOKEN', estimateGas: true, gas: 600000 })
                assert.equal(args.meta, 'META')
                assert.equal(args._invalid, false)
                assert.deepEqual(args._payoutNumerators, ["0", "10000"])
                assert.equal(args._attotokens, 42)
              },
            },
          },
        })

        estimateSubmitMigrateREP('0xMARKET', 1, false, 42, null, (err, gasCost) => {
          assert.isEqual(gasCost, 500)
        })(null, getState)
      },
    })
  })
})
