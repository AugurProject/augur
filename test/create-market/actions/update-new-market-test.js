import { describe, it } from 'mocha';
import { assert } from 'chai';

import {
  addValidationToNewMarket,
  removeValidationFromNewMarket,
  addOrderToNewMarket,
  removeOrderFromNewMarket,
  updateNewMarket,
  clearNewMarket,
  ADD_VALIDATION_TO_NEW_MARKET,
  REMOVE_VALIDATION_FROM_NEW_MARKET,
  ADD_ORDER_TO_NEW_MARKET,
  REMOVE_ORDER_FROM_NEW_MARKET,
  UPDATE_NEW_MARKET,
  CLEAR_NEW_MARKET
} from 'modules/create-market/actions/update-new-market';

describe('modules/create-market/actions/update-new-market.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertion();
    });
  };

  test({
    description: `should return the expected object for 'addValidationToNewMarket'`,
    assertion: () => {
      const action = addValidationToNewMarket({ test: 'test' });

      const expected = {
        type: ADD_VALIDATION_TO_NEW_MARKET,
        data: {
          test: 'test'
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: `should return the expected object for 'removeValidationToNewMarket'`,
    assertion: () => {
      const action = removeValidationFromNewMarket({ test: 'test' });

      const expected = {
        type: REMOVE_VALIDATION_FROM_NEW_MARKET,
        data: {
          test: 'test'
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: `should return the expected object for 'addOrderToNewMarket'`,
    assertion: () => {
      const action = addOrderToNewMarket({ test: 'test' });

      const expected = {
        type: ADD_ORDER_TO_NEW_MARKET,
        data: {
          test: 'test'
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: `should return the expected object for 'removeOrderFromNewMarket'`,
    assertion: () => {
      const action = removeOrderFromNewMarket({ test: 'test' });

      const expected = {
        type: REMOVE_ORDER_FROM_NEW_MARKET,
        data: {
          test: 'test'
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: `should return the expected object for 'updateNewMarket'`,
    assertion: () => {
      const action = updateNewMarket({ test: 'test' });

      const expected = {
        type: UPDATE_NEW_MARKET,
        data: {
          test: 'test'
        }
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });

  test({
    description: `should return the expected object for 'clearNewMarket'`,
    assertion: () => {
      const action = clearNewMarket();

      const expected = {
        type: CLEAR_NEW_MARKET
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });
});
