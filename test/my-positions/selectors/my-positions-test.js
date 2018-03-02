import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'

import myPositions, { __RewireAPI__ } from 'modules/my-positions/selectors/my-positions'

describe(`modules/my-positions/selectors/my-positions.js`, () => {
  proxyquire.noPreserveCache().noCallThru()

  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('default', () => {
    test({
      description: `should call the expected method`,
      assertions: () => {
        __RewireAPI__.__set__('selectPositionsMarkets', () => 'selectPositionsMarkets')

        const actual = myPositions()

        const expected = 'selectPositionsMarkets'

        assert.strictEqual(actual, expected, `Didn't call the expected method`)
      },
    })
  })

  describe('selectPositionsMarkets', () => {
    test({
      description: `should return the expected array`,
      assertions: () => {
        const mockMarketsAll = {
          selectMarkets: () => (
            [
              {
                id: '0xMARKETID1',
              },
              {
                id: '0xMARKETID2',
              },
              {
                id: '0xMARKETID3',
              },
            ]
          ),
        }
        const mockSelectState = {
          selectAccountPositionsState: () => (
            {
              '0xMARKETID1': {},
              '0xMARKETID3': {},
            }
          ),
        }
        const selector = proxyquire('../../../src/modules/my-positions/selectors/my-positions.js', {
          '../../markets/selectors/markets-all': mockMarketsAll,
          '../../../select-state': mockSelectState,
        })

        const actual = selector.selectPositionsMarkets()

        const expected = [
          {
            id: '0xMARKETID1',
          },
          {
            id: '0xMARKETID3',
          },
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected array`)
      },
    })
  })
})
