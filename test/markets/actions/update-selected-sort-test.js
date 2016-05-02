import {
  assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import * as action from '../../../src/modules/markets/actions/update-selected-sort';

describe('modules/markets/actions/update-selected-sort', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  let state = Object.assign({}, testState);
  let store = mockStore(state);
  let out;

  beforeEach(() => {
    store.clearActions();
    // Mock the Window object
    global.window = {};
    global.window.location = {
      pathname: '/',
      search: '?isOpen=true'
    };
    global.window.history = {
      pushState: (a, b, c) => true
    };
    global.window.scrollTo = (x, y) => true;
  });

  afterEach(() => {
    global.window = {};
  });

  it(`should return an UPDATE_SELECTED_SORT action object`, () => {
    const selectedSort = 'puppies';
    store.dispatch(action.updateSelectedSort(selectedSort));
    out = [{
      type: 'UPDATE_SELECTED_SORT',
      selectedSort: 'puppies'
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

    assert.deepEqual(store.getActions(), out, `Didn't return the correct action object`);
  });
});
