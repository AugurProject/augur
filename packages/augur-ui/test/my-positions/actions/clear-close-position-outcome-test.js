

import { CLEAR_CLOSE_POSITION_OUTCOME, clearClosePositionOutcome } from 'modules/my-positions/actions/clear-close-position-outcome'

describe('modules/my-positions/actions/clear-close-position-outcome.js', () => {
  describe('clearClosePositionTradeGroup', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions(clearClosePositionOutcome(t.arguments.marketId, t.arguments.outcomeId))
      })
    }

    test({
      description: 'should return the expected object',
      arguments: {
        marketId: '0xMarketId',
        outcomeId: '1',
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          type: CLEAR_CLOSE_POSITION_OUTCOME,
          marketId: '0xMarketId',
          outcomeId: '1',
        })
      },
    })
  })
})
