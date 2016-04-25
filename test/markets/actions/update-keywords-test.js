import {
  assert
} from 'chai';
import * as action from '../../../src/modules/markets/actions/update-keywords';

describe(`modules/markets/actions/update-keywords.js`, () => {
  it(`should dispatch UPDATE_KEYWORDS action correctly`, () => {
    const keywords = ['key', 'words'];
    const expectedOutput = {
      type: action.UPDATE_KEYWORDS,
      keywords
    };
    assert.deepEqual(action.updateKeywords(keywords), expectedOutput, `updatekeywords action didn't dispatch properly.`);
  });
});
