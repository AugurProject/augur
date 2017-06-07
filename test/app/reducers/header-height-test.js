import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import headerReducer from 'modules/app/reducers/header-height';
import { UPDATE_HEADER_HEIGHT } from 'modules/app/actions/update-header-height';

describe('modules/app/reducers/header-height', () => {
  const mockStore = configureMockStore([thunk]);

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {});

    t.assertions(store);
  });

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = headerReducer(undefined, {});

      const expected = 0;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return the expected state`,
    assertions: () => {
      const actual = headerReducer(undefined, {
        type: UPDATE_HEADER_HEIGHT,
        data: {
          headerHeight: 10
        }
      });

      const expected = 10;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });

  test({
    description: `should return the updated state`,
    assertions: () => {
      const actual = headerReducer(20, {
        type: UPDATE_HEADER_HEIGHT,
        data: {
          headerHeight: 10
        }
      });

      const expected = 10;

      assert.strictEqual(actual, expected, `didn't return the expected value`);
    }
  });
});
