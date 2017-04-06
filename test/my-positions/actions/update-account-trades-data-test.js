import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

import {
  updateSmallestPositions
} from 'modules/my-positions/actions/update-account-trades-data';

export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';

describe('modules/my-positions/actions/update-account-trades-data.js', () => {
  // proxyquire.noPreserveCache.noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const state = testState;
  const store = mockStore(state);

  afterEach(() => {
    store.clearActions();
  });

  const test = (t) => {
    it(t.description, () => {
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
});
