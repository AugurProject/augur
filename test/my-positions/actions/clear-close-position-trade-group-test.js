import { describe, it } from 'mocha';
import { assert } from 'chai';

import { CLEAR_CLOSE_POSITION_TRADE_GROUP, clearClosePositionTradeGroup } from 'modules/my-positions/actions/clear-close-position-trade-group';

describe('modules/my-positions/actions/clear-close-position-trade-group.js', () => {
  describe('clearClosePositionTradeGroup', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions(clearClosePositionTradeGroup(t.arguments.marketID, t.arguments.outcomeID));
      });
    };

    test({
      description: 'should return the expected object',
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '1'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          type: CLEAR_CLOSE_POSITION_TRADE_GROUP,
          marketID: '0xMarketID',
          outcomeID: '1'
        });
      }
    });
  });
});
