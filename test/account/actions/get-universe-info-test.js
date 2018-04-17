import { describe, it } from 'mocha'
import { assert } from 'chai'

import { BINARY } from 'modules/markets/constants/market-types'
import getUniversesInfo, { __RewireAPI__ as ReWireModule } from 'modules/account/actions/get-universe-info'

describe('modules/account/actions/get-universe-info.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('getUniversesInfo', () => {
    test({
      description: 'should return the expected object',
      assertions: () => {
        const universesData = [
          {
            universe: '0xGENESIS',
            payout: [],
            isInvalid: false,
            numMarkets: 15,
            parentUniverse: '0x0000000000000000000000000000000000000000',
          }, {
            universe: '0xCHILD_1',
            payout: [10000, 0],
            isInvalid: false,
            numMarkets: 400,
            parentUniverse: '0xGENESIS',
          },
        ]

        const stateData = {
          loginAccount: {
            address: '0xACCOUNT',
          },
          universe: {
            winningChildUniverse: '0xCHILD_1',
            forkingMarket: '0xMARKET',
            id: '0xGENESIS',
            isForking: true,
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
          api: {
            Universe: {
              getParentUniverse: (args, callback) => {
                assert.deepEqual(args, {
                  tx: { to: '0xGENESIS' },
                })
                return callback(null, '0x0000000000000000000000000000000000000000')
              },
            },
          },
          augurNode: {
            submitRequest: (methodName, args, callback) => {
              assert.equal(methodName, 'getUniversesInfo')
              assert.deepEqual(args, {
                universe: '0xGENESIS',
                account: '0xACCOUNT',
              })
              return callback(null, universesData)
            },
          },
        })

        const expected = {
          parent: null,
          children: [
            {
              universe: '0xCHILD_1',
              payout: [10000, 0],
              isInvalid: false,
              numMarkets: 400,
              parentUniverse: '0xGENESIS',
              description: 'No',
              isWinningUniverse: true,
            },
          ],
          currentLevel: [
            {
              universe: '0xGENESIS',
              payout: [],
              isInvalid: false,
              numMarkets: 15,
              parentUniverse: '0x0000000000000000000000000000000000000000',
              description: 'GENESIS',
              isWinningUniverse: false,
            },
          ],
        }

        getUniversesInfo((actual) => {
          assert.deepEqual(actual, expected, `Didn't return the expected object`)
        })(null, getState)
      },
    })
  })
})
