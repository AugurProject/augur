import { assert } from 'chai';
import * as action from '../../../src/modules/app/actions/update-branch';

describe(`modules/app/actions/update-branch.js`, () => {
  it(`should fire a 'UPDATE_BRANCH' action with branch as data`, () => {
    let test = action.updateBranch({test: 'test'});
    let out = { type: 'UPDATE_BRANCH', branch: { test: 'test' } };
    assert.deepEqual(test, out, `Didn't return the correct action object when called`);
  });
});
