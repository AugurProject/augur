import { describe, it } from 'mocha';
import { assert } from 'chai';

import { UPDATE_CLOSE_POSITION_STATUS, updateClosePositionStatus } from 'modules/my-positions/actions/update-close-position-status';

describe('modules/my-positions/actions/update-close-position-status.js', () => {
  describe('updateClosePositionStatus', () => {
    const test = (t) => {
      it(t.description, () => {
        t.assertions(updateClosePositionStatus(t.arguments.marketID, t.arguments.outcomeID, t.arguments.status));
      });
    };

    test({
      description: 'should return the expected object',
      arguments: {
        marketID: '0xMarketID',
        outcomeID: '1',
        status: 'TESTING'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          type: UPDATE_CLOSE_POSITION_STATUS,
          marketID: '0xMarketID',
          outcomeID: '1',
          status: 'TESTING'
        });
      }
    });
  });
});
