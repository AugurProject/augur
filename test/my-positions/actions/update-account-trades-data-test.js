import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  updateSmallestPositions,
  updateSellCompleteSetsLock
} from 'modules/my-positions/actions/update-account-trades-data';

export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK';

describe('modules/my-positions/actions/update-account-trades-data.js', () => {
  // proxyquire.noPreserveCache.noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state || {});
      t.assertions(store);
    });
  };

  describe('updateSmallestPositions', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        store.dispatch(updateSmallestPositions('0xMARKETID', '0'));

        const actual = store.getActions();

        const expected = [
          {
            type: UPDATE_SMALLEST_POSITIONS,
            marketID: '0xMARKETID',
            smallestPosition: '0'
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`);
      }
    });
  });

  describe('updateSellCompleteSetsLock', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        store.dispatch(updateSellCompleteSetsLock('0xMARKETID', true));

        const actual = store.getActions();

        const expected = [
          {
            type: UPDATE_SELL_COMPLETE_SETS_LOCK,
            marketID: '0xMARKETID',
            isLocked: true
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`);
      }
    });
  });
});
