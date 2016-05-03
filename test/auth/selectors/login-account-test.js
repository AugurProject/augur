import {
  assert
} from 'chai';
import proxyquire from 'proxyquire';
import testState from '../../testState';

describe(`modules/auth/selectors/login-account.js`, () => {
  proxyquire.noPreserveCache();
  let out, selector, state, fakeStore;
  state = Object.assign({}, testState, {
    loginAccount: {
      address: '0xtest123',
      id: '0xtest123',
      handle: 'testTesterson',
      ether: 50,
      realEther: 10,
      rep: 105,
      keystore: {
        id: '0xtest123'
      }
    }
  });

  fakeStore = {
    default: {
      getState: () => state
    }
  };

  out = {
    address: '0xtest123',
    id: '0xtest123',
    handle: 'testTesterson',
    ether: {
      value: 50,
      formattedValue: 50,
      formatted: '+50.00',
      roundedValue: 50,
      rounded: '+50',
      minimized: '+50',
      denomination: 'Eth',
      full: '+50.00Eth'
    },
    realEther: {
      value: 10,
      formattedValue: 10,
      formatted: '+10.00',
      roundedValue: 10,
      rounded: '+10',
      minimized: '+10',
      denomination: 'Eth',
      full: '+10.00Eth'
    },
    rep: {
      value: 105,
      formattedValue: 105,
      formatted: '+105',
      roundedValue: 105,
      rounded: '+105',
      minimized: '+105',
      denomination: 'Rep',
      full: '+105Rep'
    },
    keystore: {
      id: '0xtest123'
    }
  };

  selector = proxyquire('../../../src/modules/auth/selectors/login-account', {
    '../../../store': fakeStore
  });

  it(`should login an account`, () => {

    assert.deepEqual(selector.default(), out, `Didn't properly update account information`);
  });
});
