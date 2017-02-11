import { describe, it, beforeEach } from 'mocha';
import { assert } from 'chai';
import augur from 'augur.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/auth/actions/login.js`, () => {
  proxyquire.noPreserveCache().noCallThru();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {
    augur: {
      accounts: {},
      base58Encode: augur.base58Encode,
      getRegisterBlockNumber: () => {},
      Register: {
        register: () => {}
      }
    }
  };
  const fakeSelectors = {
    links: {
      marketsLink: {},
      loginMessageLink: {}
    }
  };
  const updateLoginAccountStub = {};
  const loadLoginAccountStub = {};
  const thisTestState = Object.assign({}, testState, {
    loginAccount: {}
  });
  const store = mockStore(thisTestState);

  fakeAugurJS.augur.accounts.login = sinon.stub().yields({
    address: 'test',
    handle: 'test',
    ether: 0,
    realEther: 0,
    rep: 0
  });
  sinon.stub(fakeAugurJS.augur.Register, 'register', (o) => {
    o.onSent({ callReturn: 1 });
    o.onSuccess({ callReturn: 1 });
  });
  sinon.stub(fakeAugurJS.augur, 'getRegisterBlockNumber', (account, cb) => {
    cb(null, 123456789);
  });

  fakeSelectors.links.marketsLink.onClick = sinon.stub();
  fakeSelectors.links.loginMessageLink.onClick = sinon.stub();

  const updateTestString = 'updateLoginAccount(loginAccount) called.';
  const loadFullAccountDataTestString = 'loadFullAccountData() called.';
  const displayLoginMessageOrMarketsTestString = 'displayLoginMessageOrMarkets called';

  updateLoginAccountStub.updateLoginAccount = sinon.stub().returns({ type: updateTestString });
  loadLoginAccountStub.loadFullAccountData = sinon.stub().returns({ type: loadFullAccountDataTestString });
  loadLoginAccountStub.displayLoginMessageOrMarkets = sinon.stub().returns({ type: displayLoginMessageOrMarketsTestString });

  const action = proxyquire('../../../src/modules/auth/actions/login', {
    '../../../services/augurjs': fakeAugurJS,
    '../../../selectors': fakeSelectors,
    '../../auth/actions/update-login-account': updateLoginAccountStub,
    '../../auth/actions/load-login-account': loadLoginAccountStub
  });

  beforeEach(() => {
    store.clearActions();
  });

  it(`should attempt to login an account given user/pass`, () => {
    store.dispatch(action.login('test', 'test'));
    const expectedOutput = [
      { type: updateTestString },
      { type: loadFullAccountDataTestString },
      { type: displayLoginMessageOrMarketsTestString }
    ];
    assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  });

});
