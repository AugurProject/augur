import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/register.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {};
  const fakeAddTransactions = {};
  const fakeSelectors = {};

  let action, store;
  let thisTestState = Object.assign({}, testState, {
    loginAccount: {}
  });
  store = mockStore(thisTestState);
  fakeAugurJS.register = (usrnm, psswrd, register, cb) => {
    cb(null, {
      address: 'test',
      id: 'test',
      handle: usrnm,
      ether: 0,
      realEther: 0,
      rep: 0
    });
  };
  fakeAddTransactions.makeTransactionID = () => {
    return 1000;
  };
  fakeSelectors.links = {
    marketsLink: {
      onClick: () => {}
    }
  };

  action = proxyquire('../../../src/modules/auth/actions/register', {
    '../../../services/augurjs': fakeAugurJS,
    '../../transactions/actions/add-transactions': fakeAddTransactions,
    '../../../selectors': fakeSelectors
  });

  beforeEach(() => {
    store.clearActions();
  });

  it(`should register a new account`, () => {
    // this should be faster, currently taking to long
    const expectedOutput = [{
      type: 'UPDATE_TRANSACTIONS_DATA',
      transactionsData: {
        '1000': {
          type: 'register',
          status: 'loading ether & rep...'
        }
      }
    }, {
      type: 'UPDATE_LOGIN_ACCOUNT',
      data: {
        address: 'test',
        id: 'test',
        handle: 'newUser',
        ether: 0,
        realEther: 0,
        rep: 0
      }
    }];

    store.dispatch(action.register('newUser', 'testing', 'testing'));

    assert.deepEqual(store.getActions(), expectedOutput, `Didn't create a new account as expected`);
  });

  it(`should fail with no username entered`, () => {
    const expectedOutput = [{
      type: 'AUTH_ERROR',
      err: {
        code: 'USERNAME_REQUIRED'
      }
    }];

    store.dispatch(action.register('', 'testing', 'testing'));

    assert.deepEqual(store.getActions(), expectedOutput, `didn't fail when user doesn't pass a username`);
  });

  it(`should fail with mismatched passwords`, () => {
    const expectedOutput = [{
      type: 'AUTH_ERROR',
      err: {
        code: 'PASSWORDS_DO_NOT_MATCH'
      }
    }, {
      type: 'AUTH_ERROR',
      err: {
        code: 'PASSWORDS_DO_NOT_MATCH'
      }
    }, {
      type: 'AUTH_ERROR',
      err: {
        code: 'PASSWORDS_DO_NOT_MATCH'
      }
    }, {
      type: 'AUTH_ERROR',
      err: {
        code: 'PASSWORDS_DO_NOT_MATCH'
      }
    }];

    store.dispatch(action.register('test', 'test', 'test1'));
    store.dispatch(action.register('test', '', 'test'));
    store.dispatch(action.register('test', 'test2', 'test'));
    store.dispatch(action.register('test', 'test1', 'test2'));

    assert.deepEqual(store.getActions(), expectedOutput, `didn't fail when user doesn't pass a username`);
  });
});
