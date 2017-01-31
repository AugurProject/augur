import { describe, it } from 'mocha';
import { assert } from 'chai';

import { UPDATE_CLOSE_POSITION_STATUS } from 'modules/my-positions/actions/update-close-position-status';

import * as closePositionStatus from 'modules/my-positions/reducers/close-position-status';

describe('modules/my-positions/reducers/close-position-status.js', () => {
  describe('clearClosePositionTradeGroup', () => {
    const test = (t) => {
      it(t.description, () => {
        if (t.defaultState) {
          t.assertions(closePositionStatus.default(undefined, t.action));
        } else {
          const existingClosePositionStatus = {
            '0xMarketID1': {
              0: 'EXISTING_STATUS'
            }
          };

          t.assertions(closePositionStatus.default(existingClosePositionStatus, t.action));
        }
      });
    };

    test({
      description: 'should return the default state',
      action: {},
      defaultState: true,
      assertions: (res) => {
        assert.deepEqual(res, {});
      }
    });

    test({
      description: 'should return existing state',
      action: {},
      assertions: (res) => {
        assert.deepEqual(res, {
          '0xMarketID1': {
            0: 'EXISTING_STATUS'
          }
        });
      }
    });

    test({
      description: 'should return updated existing outcome',
      action: {
        type: UPDATE_CLOSE_POSITION_STATUS,
        marketID: '0xMarketID1',
        outcomeID: '0',
        status: 'UPDATED_STATUS'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          '0xMarketID1': {
            0: 'UPDATED_STATUS'
          }
        });
      }
    });

    test({
      description: 'should return an existing market with an addtional outcome status',
      action: {
        type: UPDATE_CLOSE_POSITION_STATUS,
        marketID: '0xMarketID1',
        outcomeID: '1',
        status: 'UPDATED_STATUS'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          '0xMarketID1': {
            0: 'EXISTING_STATUS',
            1: 'UPDATED_STATUS'
          }
        });
      }
    });

    test({
      description: 'should return an addtional market with an outcome status',
      action: {
        type: UPDATE_CLOSE_POSITION_STATUS,
        marketID: '0xMarketID2',
        outcomeID: '3',
        status: 'UPDATED_STATUS'
      },
      assertions: (res) => {
        assert.deepEqual(res, {
          '0xMarketID1': {
            0: 'EXISTING_STATUS'
          },
          '0xMarketID2': {
            3: 'UPDATED_STATUS'
          }
        });
      }
    });
  });
});
