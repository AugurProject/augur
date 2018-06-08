import { describe, it } from 'mocha'
import { assert } from 'chai'

import { YES_NO } from 'modules/markets/constants/market-types'
import { getForkMigrationTotals, __RewireAPI__ as ReWireModule } from 'modules/forking/actions/get-fork-migration-totals'

describe('modules/forking/actions/get-fork-migration-totals.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('getForkMigrationTotals', () => {
    test({
      description: 'should return the expected object',
      assertions: () => {
        const forkMigrationTotalsData = {
          '0xCHILD_1': {
            payout: [0, 10000],
            isInvalid: false,
            repTotal: 200,
            universe: '0xCHILD_1',
          },
          '0xCHILD_2': {
            payout: [10000, 0],
            isInvalid: false,
            repTotal: 400,
            universe: '0xCHILD_2',
          },
        }

        const stateData = {
          universe: {
            winningChildUniverse: '0xCHILD_1',
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
              getForkingMarket: (args, callback) => {
                assert.deepEqual(args, {
                  tx: { to: '0xUNIVERSE' },
                })
                return callback(null, '0xMARKET')
              },
            },
          },
          augurNode: {
            submitRequest: (methodName, args, callback) => {
              assert.equal(methodName, 'getForkMigrationTotals')
              assert.deepEqual(args, {
                parentUniverse: '0xUNIVERSE',
              })
              return callback(null, forkMigrationTotalsData)
            },
          },
        })
        const expected = {
          0: {
            repTotal: 400,
            winner: false,
            isInvalid: false,
          },
          1: {
            repTotal: 200,
            winner: true,
            isInvalid: false,
          },
        }

        getForkMigrationTotals('0xUNIVERSE', (err, actual) => {
          assert.deepEqual(actual, expected, `Didn't return the expected object`)
        })(null, getState)
      },
    })
  })
})
