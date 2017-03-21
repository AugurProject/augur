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
      t.assertions();
    });
  };

  test({
    description: `should return the expected object for 'addValidationToNewMarket'`,
    assertions: () => {
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
    assertions: () => {
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
    assertions: () => {
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
    assertions: () => {
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
    assertions: () => {
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
    assertions: () => {
      const action = clearNewMarket();

      const expected = {
        type: CLEAR_NEW_MARKET
      };

      assert.deepEqual(action, expected, `Didn't return the expected object`);
    }
  });
});
