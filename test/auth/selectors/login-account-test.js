import { describe, it } from 'mocha';
import proxyquire from 'proxyquire';
import loginAccountAssertions from 'assertions/login-account';

describe(`modules/account/selectors/login-account.js`, () => {
  proxyquire.noPreserveCache();
  const selector = proxyquire('../../../src/modules/account/selectors/login-account', {});
  it(`should login an account`, () => {
    loginAccountAssertions(selector.selectLoginAccount({
      loginAccount: {
        address: '0xb0b',
        isUnlocked: false,
        localNode: false,
        name: 'bob',
        loginID: 'loginID',
        privateKey: new Buffer('1337', 'hex')
      }
    }));
  });
});
