import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import augur from 'augur.js';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/auth/actions/register.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {
    augur: {
      accounts: {
        account: { address: 'test' }
      },
      base58Encode: augur.base58Encode
    }
  };
  const fakeAuthLink = {};
  const fakeSelectors = {};
  const updtLoginAccStub = {};
  const ldLoginAccStub = {
    loadLoginAccountDependents: () => {}
  };

  const thisTestState = Object.assign({}, testState, {
    loginAccount: {}
  });
  const store = mockStore(thisTestState);
  const fakeCallback = sinon.stub();
  fakeAugurJS.augur.accounts.register = (name, psswrd, cb) => {
    cb({
      address: 'test',
      loginID: 'testid',
      name,
      ether: 0,
      realEther: 0,
      rep: 0
    });
  };
  fakeSelectors.links = {
    marketsLink: {
      onClick: () => {}
    },
    loginMessageLink: {
      onClick: () => {}
    },
  };
  fakeAuthLink.selectAuthLink = (page, bool, dispatch) => ({ onClick: () => {} });
  const updateTestString = 'updateLoginAccount(loginAccount) called.';
  const ldLoginAccDepTestString = 'loadLoginAccountDependents() called.';
  const ldLoginAccLSTestString = 'loadLoginAccountLocalStorage(id) called.';

  updtLoginAccStub.updateLoginAccount = sinon.stub().returns({ type: updateTestString });
  // ldLoginAccStub.loadLoginAccountDependents = sinon.stub().returns({type: ldLoginAccDepTestString });
  sinon.stub(ldLoginAccStub, 'loadLoginAccountDependents', (cb) => {
    if (cb) cb(null, 2.5);
    return { type: ldLoginAccDepTestString };
  });
  ldLoginAccStub.loadLoginAccountLocalStorage = sinon.stub().returns({ type: ldLoginAccLSTestString });

  const action = proxyquire('../../../src/modules/auth/actions/register', {
    '../../../services/augurjs': fakeAugurJS,
    '../../../selectors': fakeSelectors,
    '../../link/selectors/links': fakeAuthLink,
    '../../auth/actions/update-login-account': updtLoginAccStub,
    '../../auth/actions/load-login-account': ldLoginAccStub
  });

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    store.clearActions();
  });

  it(`should register a new account`, () => {
    const expectedOutput = [{
      type: 'updateLoginAccount(loginAccount) called.'
    }, {
      type: 'loadLoginAccountLocalStorage(id) called.'
    }, {
      type: 'updateLoginAccount(loginAccount) called.'
    }, {
      type: 'loadLoginAccountDependents() called.'
    }];

    store.dispatch(action.register('Passw0rd', fakeCallback));
    store.dispatch(action.setupAndFundNewAccount('Passw0rd', testState.loginAccount.loginID, false, fakeCallback));

    console.log('fack -- ', fakeCallback.callCount);

    assert(fakeCallback.calledTwice, `the callback wasn't triggered 2 times as expected`);
    assert.deepEqual(store.getActions(), expectedOutput, `Didn't create a new account as expected`);
  });
});
