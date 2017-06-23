import { describe, it } from 'mocha';
import { assert } from 'chai';
import { UPDATE_URL } from 'modules/link/actions/update-url';
import { DEFAULT_VIEW } from 'modules/app/constants/views';
import activeViewReducer from 'modules/app/reducers/active-view';

describe(`modules/app/reducers/active-page.js`, () => {
  const test = t => it(t.description, () => t.assertions());

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = activeViewReducer(undefined, {});
      const expected = DEFAULT_VIEW;

      assert.strictEqual(actual, expected, `didn't return the expected string`);
    }
  });

  test({
    description: `should return the updated state`,
    assertions: () => {
      const actual = activeViewReducer(undefined, {
        type: UPDATE_URL,
        parsedURL: {
          searchParams: {
            page: 'view'
          }
        }
      });

      const expected = 'view';

      assert.strictEqual(actual, expected, `didn't return the expected string`);
    }
  });
});
