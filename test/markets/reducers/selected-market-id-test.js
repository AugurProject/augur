import { assert } from 'chai';
import { SHOW_LINK } from '../../../src/modules/link/actions/show-link';
import reducer from '../../../src/modules/markets/reducers/selected-market-id';
import testState from '../../testState';

describe(`modules/markets/reducers/selected-market-id.js`, () => {
  let action, out, test;
  let state = Object.assign({}, testState);

  it(`should change the selected market id`, () => {
    action = {type: SHOW_LINK, parsedURL: { pathArray: ['/m','_test']}};
    test = reducer(state.selectedMarketID, action);
    out = 'test';
    assert.equal(test, out, `Didn't get the substring of pathArray[1]`);
  });
});
