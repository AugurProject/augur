import { describe, it } from 'mocha'
import { assert } from 'chai'

import { ADD_CLOSE_POSITION_TRADE_GROUP, addClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group'

describe('modules/my-positions/actions/add-close-position-trade-group.js', () => {
  describe('addClosePositionTradeGroup', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions(addClosePositionTradeGroup(t.arguments.marketID, t.arguments.outcomeID, t.arguments.tradeGroupID))
      })
    }

    test({
      description: 'should return the expected object',
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '1',
        tradeGroupID: '0x00000TradeGroupID'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          type: ADD_CLOSE_POSITION_TRADE_GROUP,
          marketID: '0xMarketID',
          outcomeID: '1',
          tradeGroupID: '0x00000TradeGroupID'
        })
      }
    })
  })
})
