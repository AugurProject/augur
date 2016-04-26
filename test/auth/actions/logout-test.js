import { assert } from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/auth/actions/logout.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {};
  let action, store;
  let testState = {
    auth: {
      err: null,
      selectedAuthType: 'register'
    }
  };

  beforeEach(() => {
    store = mockStore(testState);
    fakeAugurJS.logout = () => {
      return;
    };
  });

  it(`should logout of the logged in account`, () => {
    action = proxyquire('../../../src/modules/auth/actions/logout', {
      '../../../services/augurjs': fakeAugurJS
    });
    const expectedOutput = [ { type: 'CLEAR_LOGIN_ACCOUNT' }];

    store.dispatch(action.logout());
    assert.deepEqual(store.getActions(), expectedOutput, `It didn't logout as expected`);
  });
});
