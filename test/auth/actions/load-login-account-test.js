import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/auth/actions/load-login-account.js`, () => {

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {};
  let actions, store;
  let testState = {
    auth: {
      err: null,
      selectedAuthType: 'register'
    }
  };

  beforeEach(() => {
    store = mockStore(testState);
    fakeAugurJS.loadLoginAccount = (isHosted, cb) => {
      // console.log('hit');
      cb(null, {
        id: 123456789
      });
    };
  });

  it(`should update the login account`);
// , () => {
    // This is going to be very complicated....
    // actions = proxyquire('../../../src/modules/auth/actions/load-login-account', {
    //   '../../../services/augurjs': fakeAugurJS
    // });

    // store.dispatch(actions.loadLoginAccount());
    // console.log(store.getActions());
    // assert.deepEqual(actions.loadLoginAccount(), {});
  // });

  it(`should load login account dependents`);
});
