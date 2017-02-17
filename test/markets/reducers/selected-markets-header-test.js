import { describe, it } from 'mocha';
import { assert } from 'chai';

import selectedMarketsHeader from 'modules/markets/reducers/selected-markets-header';

import { UPDATE_URL } from 'modules/link/actions/update-url';
import { UPDATE_SELECTED_MARKETS_HEADER } from 'modules/markets/actions/update-selected-markets-header';

describe('modules/markets/reducers/selected-markets-header.js', () => {
  const test = (t) => {
    it(t.describe, () => {
      t.assertions();
    });
  };

  test({
    describe: 'should return the default value',
    assertions: () => {
      const actual = selectedMarketsHeader(undefined, { type: null });

      const expected = null;

      assert.equal(actual, expected, `Didn't return the expected default value`);
    }
  });

  test({
    describe: 'should return the existing value',
    assertions: () => {
      const actual = selectedMarketsHeader('value', { type: null });

      const expected = 'value';

      assert.equal(actual, expected, `Didn't return the expected existing value`);
    }
  });

  test({
    describe: `should return the updated value with case '${UPDATE_SELECTED_MARKETS_HEADER}'`,
    assertions: () => {
      const actual = selectedMarketsHeader('old value', {
        type: UPDATE_SELECTED_MARKETS_HEADER,
        selectedMarketsHeader: 'new value'
      });

      const expected = 'new value';

      assert.equal(actual, expected, `Didn't return the expected updated value`);
    }
  });

  test({
    describe: `should return the updated value with case '${UPDATE_URL}' and subset param present`,
    assertions: () => {
      const actual = selectedMarketsHeader('old value', {
        type: UPDATE_URL,
        parsedURL: {
          searchParams: {
            subset: 'new value'
          }
        }
      });

      const expected = 'new value';

      assert.equal(actual, expected, `Didn't return the expected updated value`);
    }
  });

  test({
    describe: `should return the updated value with case '${UPDATE_URL}' and subset param present`,
    assertions: () => {
      const actual = selectedMarketsHeader('old value', {
        type: UPDATE_URL,
        parsedURL: {
          searchParams: {
            subset: 'new value'
          }
        }
      });

      const expected = 'new value';

      assert.equal(actual, expected, `Didn't return the expected updated value`);
    }
  });

  test({
    describe: `should return the updated value with case '${UPDATE_URL}' and no params present`,
    assertions: () => {
      const actual = selectedMarketsHeader('old value', {
        type: UPDATE_URL,
        parsedURL: {
          searchParams: {
            keywords: 'testing'
          }
        }
      });

      const expected = null;

      assert.equal(actual, expected, `Didn't return the expected updated value`);
    }
  });
});
