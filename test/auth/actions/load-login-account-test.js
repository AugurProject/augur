import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import {
  updateLoginAccount
} from '../../../src/modules/auth/actions/update-login-account';

describe(`modules/auth/actions/load-login-account.js`, () => {
  proxyquire.noPreserveCache();
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const fakeAugurJS = {};
  const fakeUpdateAssets = {};
  const fakeLoadAcctTrades = {};
  let action, store;
  let thisTestState = Object.assign({}, testState, {
    loginAccount: {}
  });
  store = mockStore(thisTestState);
  fakeAugurJS.loadLoginAccount = (isHosted, cb) => {
    cb(null, {
      id: 123456789
    });
  };
  fakeUpdateAssets.updateAssets = () => {
    return (dispatch, getState) => {
      let ether = 500,
        rep = 25,
        realEther = 100;
      dispatch(updateLoginAccount({
        ether
      }));
      dispatch(updateLoginAccount({
        rep
      }));
      dispatch(updateLoginAccount({
        realEther
      }));
    };
  };
  fakeLoadAcctTrades.loadAccountTrades = () => {
    return;
  };

  action = proxyquire('../../../src/modules/auth/actions/load-login-account', {
    '../../../services/augurjs': fakeAugurJS,
    '../../auth/actions/update-assets': fakeUpdateAssets,
    '../../positions/actions/load-account-trades': fakeLoadAcctTrades,
    '@noCallThru': true
  });

  beforeEach(() => {
    store.clearActions();
  });

  it(`should update the login account`, () => {
    store.dispatch(action.loadLoginAccount());
    const expectedOutput = [{
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          id: 123456789
        }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          ether: 500
        }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          rep: 25
        }
      }, {
        type: 'UPDATE_LOGIN_ACCOUNT',
        data: {
          realEther: 100
        }
      },
      undefined, {
        type: 'CLEAR_REPORTS'
      }
    ];
    assert.deepEqual(store.getActions(), expectedOutput, `didn't properly update the logged in account`);
  });
});
