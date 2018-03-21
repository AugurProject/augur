

import { ADD_CLOSE_POSITION_TRADE_GROUP, addClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group'

describe('modules/my-positions/actions/add-close-position-trade-group.js', () => {
  describe('addClosePositionTradeGroup', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions(addClosePositionTradeGroup(t.arguments.marketId, t.arguments.outcomeId, t.arguments.tradeGroupId))
      })
    }

    test({
      description: 'should return the expected object',
      arguments: {
        marketId: '0xMarketId',
        outcomeId: '1',
        tradeGroupId: '0x00000TradeGroupId',
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          type: ADD_CLOSE_POSITION_TRADE_GROUP,
          marketId: '0xMarketId',
          outcomeId: '1',
          tradeGroupId: '0x00000TradeGroupId',
        })
      },
    })
  })
})
