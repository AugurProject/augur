import {assert} from 'chai';
import * as action from '../../../src/modules/markets/actions/update-selected-sort';

describe('modules/markets/actions/update-selected-sort', () => {
  it(`should return an UPDATE_SELECTED_SORT action object`, () => {
    const selectedSort = 'puppies';
    const expectedOutput = { type: action.UPDATE_SELECTED_SORT, selectedSort };
    assert.deepEqual(action.updateSelectedSort(selectedSort), expectedOutput, `Didn't return the correct action object`);
  });
});
