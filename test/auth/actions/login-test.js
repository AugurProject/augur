import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/login.js`, () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {};
  const fakeSelectors = {};
  let action, store;
  let thisTestState = Object.assign({}, testState, {
    loginAccount: {}
  });
  store = mockStore(thisTestState);
  fakeAugurJS.login = (usrnm, psswrd, aBoolean, cb) => {
    cb(null, {
      address: 'test',
      id: 'test',
      handle: usrnm,
      ether: 0,
      realEther: 0,
      rep: 0
    });
  };
  fakeSelectors.links = {
    marketsLink: {
      onClick: () => {}
    }
  };
  action = proxyquire('../../../src/modules/auth/actions/login', {
    '../../../services/augurjs': fakeAugurJS,
    '../../../selectors': fakeSelectors,
    '@noCallThru': true
  });

  beforeEach(() => {
    store.clearActions();
  });

  it(`should attempt to login an account given user/pass`, () => {
    store.dispatch(action.login('test', 'test', 'test'));
    const expectedOutput = [{
      type: 'UPDATE_LOGIN_ACCOUNT',
      data: {
        address: 'test',
        id: 'test',
        handle: 'test',
        ether: 0,
        realEther: 0,
        rep: 0
      }
    }, {
      type: 'UPDATE_LOGIN_ACCOUNT',
      data: {
        ether: undefined,
        realEther: undefined,
        rep: undefined
      }
    }, {
      type: 'CLEAR_REPORTS'
    }];
    assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  });
});
