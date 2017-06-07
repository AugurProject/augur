import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import isMobileReducer from 'modules/app/reducers/is-mobile';
import { UPDATE_IS_MOBILE } from 'modules/app/actions/update-is-mobile';

describe('modules/app/reducers/header-height', () => {
  const mockStore = configureMockStore([thunk]);

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {});

    t.assertions(store);
  });

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = isMobileReducer(undefined, {});

      const expected = false;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return the expected state`,
    assertions: () => {
      const actual = isMobileReducer(undefined, {
        type: UPDATE_IS_MOBILE,
        data: {
          isMobile: true
        }
      });

      const expected = true;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return the updated state`,
    assertions: () => {
      const actual = isMobileReducer(true, {
        type: UPDATE_IS_MOBILE,
        data: {
          isMobile: false
        }
      });

      const expected = false;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });
});
