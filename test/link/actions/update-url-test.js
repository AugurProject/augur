import { describe, it, beforeEach, afterEach, after } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import testState from 'test/testState';
import * as mockStore from 'test/mockStore';

describe(`modules/link/actions/update-url.js`, () => {
  const setTitle = require('utils/set-title');
  const { store } = mockStore.default;
  const URL = '/test?search=example';

  const mockFullMarket = {};
  mockFullMarket.loadFullMarket = sinon.stub().returns({
    type: 'UPDATE_URL',
    value: 'loadFullMarket has been called, this is a stub.'
  });

  sinon.spy(setTitle, 'default');

  const action = proxyquire('../../../src/modules/link/actions/update-url', {
    '../../market/actions/load-full-market': mockFullMarket
  });

  beforeEach(() => {
    store.clearActions();
    // Mock the window object
    global.window = {};
    global.window.location = {
      pathname: '/test',
      search: 'example'
    };
    global.window.history = {
      state: [],
      pushState: (a, b, c) => window.history.state.push(c)
    };
    global.window.scrollTo = (x, y) => true;

    global.document = {};
    setTitle.default.reset();
  });

  afterEach(() => {
    global.window = {};
  });

  after(() => {
    setTitle.default.restore();
  });

  it(`should call 'setTitle' if no title is passed in`, () => {
    store.dispatch(action.updateURL(URL));

    assert(setTitle.default.calledOnce, `'setTitle' was not called once as expected`);
  });

  it(`should call 'setTitle' if a title is passed in`, () => {
    store.dispatch(action.updateURL(URL, 'test'));

    assert(setTitle.default.calledOnce, `'setTitle' was not called once as expected`);
  });

  it(`should not call 'setTitle' if a title is passed in as 'false'`, () => {
    store.dispatch(action.updateURL(URL, false));

    assert(setTitle.default.notCalled, `'setTitle' was unexpectedly called`);
  });

  it(`should dispatch a UPDATE_URL action type with a parsed URL`, () => {
    store.dispatch(action.updateURL(URL));
    const out = [{
      type: 'UPDATE_URL',
      parsedURL: {
        searchParams: {
          search: 'example'
        },
        url: '/?search=example'
      }
    }];

    assert.deepEqual(store.getActions(), out, `Didn't parse the url correctly`);
  });

  it(`should dispatch 'loadFullMarket' when url is a market`, () => {
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const customState = {
      loginAccount: {
        address: '0xtest'
      },
      connection: {
        isConnected: true
      },
      branch: {
        id: '12345'
      }
    };

    const store = mockStore(customState);

    store.dispatch(action.updateURL('?page=m&m=testing_0xtest'));

    const out = [
      {
        type: 'UPDATE_URL',
        parsedURL: {
          searchParams: {
            m: 'testing_0xtest',
            page: 'm'
          },
          url: '/?page=m&m=testing_0xtest'
        }
      },
      {
        type: 'UPDATE_URL',
        value: 'loadFullMarket has been called, this is a stub.'
      }
    ];

    assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
  });
});
