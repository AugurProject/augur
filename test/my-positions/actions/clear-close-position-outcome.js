import { describe, it } from 'mocha'
import { assert } from 'chai'

import { CLEAR_CLOSE_POSITION_OUTCOME, clearClosePositionOutcome } from 'modules/my-positions/actions/clear-close-position-outcome'

describe('modules/my-positions/actions/clear-close-position-outcome.js', () => {
  describe('clearClosePositionTradeGroup', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions(clearClosePositionOutcome(t.arguments.marketID, t.arguments.outcomeID))
      })
    }

    test({
      description: 'should return the expected object',
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '1'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          type: CLEAR_CLOSE_POSITION_OUTCOME,
          marketID: '0xMarketID',
          outcomeID: '1'
        })
      }
    })
  })
})
