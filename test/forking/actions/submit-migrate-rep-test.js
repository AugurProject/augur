import { describe, it } from 'mocha'
import { assert } from 'chai'

import { YES_NO } from 'modules/markets/constants/market-types'
import { submitMigrateREP, __RewireAPI__ as ReWireModule } from 'modules/forking/actions/submit-migrate-rep'

describe('modules/forking/actions/submit-migrate-rep.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('submitMigrateREP', () => {
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
              marketType: YES_NO,
            },
          },
        }

        const getState = () => stateData

        ReWireModule.__Rewire__('augur', {
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
                assert.deepEqual(args.tx, { to: '0xREP_TOKEN', estimateGas: false })
                assert.equal(args.meta, 'META')
                assert.equal(args._invalid, false)
                assert.deepEqual(args._payoutNumerators.map(n => n.toString()), ['0', '10000'])
                assert.equal(args._attotokens, 42)
              },
            },
          },
        })

        submitMigrateREP(false, '0xMARKET', 1, false, 42, null, () => {})(null, getState)
      },
    })
  })
})
