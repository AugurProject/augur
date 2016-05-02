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
  const updtLoginAccStub = {};
  const ldLoginAccStub = {};
  const autoStub = {};
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

  let updateTestString = 'updateLoginAccount(loginAccount) called.';
  let ldLoginAccDepTestString = 'loadLoginAccountDependents() called.';
  let ldLoginAccLSTestString = 'loadLoginAccountLocalStorage(id) called.';
  let autoTestString = 'autoReportSequence() called.';

  updtLoginAccStub.updateLoginAccount = (loginAccount) => updateTestString;
  ldLoginAccStub.loadLoginAccountDependents = () => ldLoginAccDepTestString;
  ldLoginAccStub.loadLoginAccountLocalStorage = (id) => ldLoginAccLSTestString;
  autoStub.autoReportSequence = () => autoTestString;

  action = proxyquire('../../../src/modules/auth/actions/login', {
    '../../../services/augurjs': fakeAugurJS,
    '../../../selectors': fakeSelectors,
    '../../auth/actions/update-login-account': updtLoginAccStub,
    '../../auth/actions/load-login-account': ldLoginAccStub,
    '../../reports/actions/auto-report-sequence': autoStub
  });

  beforeEach(() => {
    store.clearActions();
  });

  it(`should attempt to login an account given user/pass`, () => {
    store.dispatch(action.login('test', 'test', 'test'));
    const expectedOutput = [ldLoginAccLSTestString, updateTestString, ldLoginAccDepTestString, autoTestString];
    assert.deepEqual(store.getActions(), expectedOutput, `didn't login to the account correcty`);
  });

});
