import {
  assert
} from 'chai';
import {
  UPDATE_SELECTED_SORT
} from '../../../src/modules/markets/actions/update-selected-sort';
import reducer from '../../../src/modules/markets/reducers/selected-sort';

describe(`modules/markets/reducers/selected-sort.js`, () => {
  it(`should update the selected sort`, () => {
    const action = {
      type: UPDATE_SELECTED_SORT,
      selectedSort: {
        prop: 'test',
        isDesc: false
      }
    };
    const expectedOutput = {
      prop: 'test',
      isDesc: false
    };

    assert.deepEqual(reducer(undefined, action), expectedOutput, `It didn't return the correct output.`);
    assert.deepEqual(reducer({
      prop: 'someprop',
      isDesc: true
    }, action), expectedOutput, `It didn't retun the correct output given a state.`);
  });
});
