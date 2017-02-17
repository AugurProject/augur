import { describe, it } from 'mocha';
import { assert } from 'chai';

import selectedTopic from 'modules/topics/reducers/selected-topic';

import { UPDATE_URL } from 'modules/link/actions/update-url';

describe('modules/topics/reducers/selected-topic.js', () => {
  const test = (t) => {
    it(t.describe, () => {
      t.assertions();
    });
  };

  test({
    describe: 'should return the default value',
    assertions: () => {
      const actual = selectedTopic(undefined, { type: null });

      const expected = null;

      assert.equal(actual, expected, `Didn't return the expected default value`);
    }
  });

  test({
    describe: 'should return the existing value',
    assertions: () => {
      const actual = selectedTopic('topic', { type: null });

      const expected = 'topic';

      assert.equal(actual, expected, `Didn't return the expected existing value`);
    }
  });

  test({
    describe: 'should return the updated value',
    assertions: () => {
      const actual = selectedTopic('topic', {
        type: UPDATE_URL,
        parsedURL: {
          searchParams: {
            topic: 'new topic'
          }
        }
      });

      const expected = 'new topic';

      assert.equal(actual, expected, `Didn't return the expected updated value`);
    }
  });
});
