import { assert } from 'chai';
import * as action from '../../../src/modules/markets/actions/toggle-filter.js';

describe(`modules/markets/actions/toggle-fiter.js`, () => {
  it(`should dispatch a toggle filter action`, () => {
      const filterID = '123test456';
      const expectedOutput = { type: action.TOGGLE_FILTER, filterID };

      assert.deepEqual(action.toggleFilter(filterID), expectedOutput, `it didn't dispatch the correct action!`);
  });
});
