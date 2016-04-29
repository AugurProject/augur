import {
  assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/markets/actions/toggle-filter.js';

describe(`modules/markets/actions/toggle-fiter.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let state = Object.assign({}, testState);
  let store = mockStore(state);
  let out;
  // Mock the Window object;
  global.window = {};
  global.window.location = {
    pathname: '/',
    search: '?isOpen=true'
  };
  global.window.history = {
    pushState: (a, b, c) => true
  };
  global.window.scrollTo = (x, y) => true;

  it(`should dispatch a toggle filter action`, () => {
    const filterID = '123test456';
    store.dispatch(action.toggleFilter(filterID));
    out = [{
      type: 'TOGGLE_FILTER',
      filterID: '123test456'
    }, {
      type: 'SHOW_LINK',
      parsedURL: {
        pathArray: ['/'],
        searchParams: {
          isOpen: 'true'
        },
        url: '/?isOpen=true'
      }
    }];

    assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions for toggle-filter`);
  });
});
