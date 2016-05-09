import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/login.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {};
  const fakeSelectors = {
    links: {
      marketsLink: {}
    }
  };
  const updtLoginAccStub = {};
  const ldLoginAccStub = {};
  const autoStub = {};
  let action, store;
  let thisTestState = Object.assign({}, testState, {
    loginAccount: {}
  });
  store = mockStore(thisTestState);

  fakeAugurJS.login = sinon.stub().yields(null, {
    address: 'test',
    id: 'test',
    handle: 'test',
    ether: 0,
    realEther: 0,
    rep: 0
  });

  fakeSelectors.links.marketsLink.onClick = sinon.stub();

  let updateTestString = 'updateLoginAccount(loginAccount) called.';
  let ldLoginAccDepTestString = 'loadLoginAccountDependents() called.';
  let ldLoginAccLSTestString = 'loadLoginAccountLocalStorage(id) called.';

  updtLoginAccStub.updateLoginAccount = sinon.stub().returns(updateTestString);
  ldLoginAccStub.loadLoginAccountDependents = sinon.stub().returns(ldLoginAccDepTestString);
  ldLoginAccStub.loadLoginAccountLocalStorage = sinon.stub().returns(ldLoginAccLSTestString);

  action = proxyquire('../../../src/modules/auth/actions/login', {
    '../../../services/augurjs': fakeAugurJS,
    '../../../selectors': fakeSelectors,
    '../../auth/actions/update-login-account': updtLoginAccStub,
    '../../auth/actions/load-login-account': ldLoginAccStub,
    '@noCallThru': true
  });

  beforeEach(() => {
    store.clearActions();
  });

  it(`should attempt to login an account given user/pass`, () => {
    store.dispatch(action.login('test', 'test', 'test'));
    const expectedOutput = [ldLoginAccLSTestString, updateTestString, ldLoginAccDepTestString];
    assert(updtLoginAccStub.updateLoginAccount.calledOnce, `updateLoginAccount() wasn't called once as expected.`);
    assert(ldLoginAccStub.loadLoginAccountDependents.calledOnce, `loadLoginAccountDependents() wasn't called once as expected`);
    assert(ldLoginAccStub.loadLoginAccountLocalStorage.calledOnce, `loadLoginAccountLocalStorage() wasn't called once as expected`);
    assert(fakeSelectors.links.marketsLink.onClick.calledOnce, `marketsLink.onClick() wasn't called once as expected`);
    assert(fakeAugurJS.login.calledOnce, `login() wasn't called once as expected`);
    assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  });

});
