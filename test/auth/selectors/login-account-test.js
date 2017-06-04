import { describe, it } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';

import loginAccount, { selectLoginAccount, __RewireAPI__ as LoginAccountRewireAPI } from 'modules/auth/selectors/login-account';

import { formatRep, formatEther, formatEtherTokens } from 'utils/format-number';

describe(`modules/auth/selectors/login-account.js`, () => {
  const test = t => it(t.description, done => t.assertions(done));

  describe('default', () => {
    test({
      description: `should call 'selectLoginAccount'`,
      assertions: (done) => {
        const stubbedSelectLoginAccount = sinon.stub();

        LoginAccountRewireAPI.__Rewire__('selectLoginAccount', stubbedSelectLoginAccount);

        loginAccount();

        LoginAccountRewireAPI.__ResetDependency__('selectLoginAccount');

        assert(stubbedSelectLoginAccount.calledOnce, `didn't call 'selectLoginAccount' once as expected`);

        done();
      }
    });
  });

  describe('selectLoginAccount', function () { // eslint-disable-line func-names, prefer-arrow-callback
    after(() => {
      this.clock.restore();
    });

    test({
      description: `should return the expected object when user is unlogged`,
      assertions: (done) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        const loginAccount = {};
        const stubbedGenerateDownloadAccountLink = sinon.stub();

        LoginAccountRewireAPI.__Rewire__('generateDownloadAccountLink', stubbedGenerateDownloadAccountLink);

        const actual = selectLoginAccount.resultFunc(loginAccount);

        const expected = {
          trimmedLoginID: null,
          trimmedAddress: null,
          linkText: null,
          rep: formatRep(undefined),
          eth: formatEther(undefined),
          ethTokens: formatEtherTokens(undefined)
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`);

        LoginAccountRewireAPI.__ResetDependency__('generateDownloadAccountLink');

        done();
      }
    });

    test({
      description: `should return the expected object when user is logged via loginID with account locked`,
      assertions: (done) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        const loginAccount = {
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          eth: '10',
          ethTokens: '11',
          rep: '12'
        };
        const stubbedGenerateDownloadAccountLink = sinon.stub();

        LoginAccountRewireAPI.__Rewire__('generateDownloadAccountLink', stubbedGenerateDownloadAccountLink);

        const actual = selectLoginAccount.resultFunc(loginAccount);

        const expected = {
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          trimmedLoginID: '123T...inID',
          trimmedAddress: '0xAc...ress',
          linkText: '123T...inID',
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
          ethTokens: formatEtherTokens(11, { zeroStyled: false, decimalsRounded: 2 })
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`);

        LoginAccountRewireAPI.__ResetDependency__('generateDownloadAccountLink');

        done();
      }
    });

    test({
      description: `should return the expected object when user is logged via loginID with account locked and name encoded`,
      assertions: (done) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        const loginAccount = {
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          eth: '10',
          ethTokens: '11',
          rep: '12',
          name: 'test-user'
        };
        const stubbedGenerateDownloadAccountLink = sinon.stub();

        LoginAccountRewireAPI.__Rewire__('generateDownloadAccountLink', stubbedGenerateDownloadAccountLink);

        const actual = selectLoginAccount.resultFunc(loginAccount);

        const expected = {
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          trimmedLoginID: '123T...inID',
          trimmedAddress: '0xAc...ress',
          linkText: 'test-user',
          name: 'test-user',
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
          ethTokens: formatEtherTokens(11, { zeroStyled: false, decimalsRounded: 2 })
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`);

        LoginAccountRewireAPI.__ResetDependency__('generateDownloadAccountLink');

        done();
      }
    });

    test({
      description: `should return the expected object when user is logged via loginID with account UNlocked`,
      assertions: (done) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        const loginAccount = {
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          eth: '10',
          ethTokens: '11',
          rep: '12',
          isUnlocked: true
        };
        const stubbedGenerateDownloadAccountLink = sinon.stub();

        LoginAccountRewireAPI.__Rewire__('generateDownloadAccountLink', stubbedGenerateDownloadAccountLink);

        const actual = selectLoginAccount.resultFunc(loginAccount);

        const expected = {
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          trimmedLoginID: '123T...inID',
          trimmedAddress: '0xAc...ress',
          linkText: '0xAc...ress',
          isUnlocked: true,
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
          ethTokens: formatEtherTokens(11, { zeroStyled: false, decimalsRounded: 2 })
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`);

        LoginAccountRewireAPI.__ResetDependency__('generateDownloadAccountLink');

        done();
      }
    });

    test({
      description: `should return the expected object when user is logged via airbitz`,
      assertions: (done) => {
        this.clock = sinon.useFakeTimers(1485907200000);

        const loginAccount = {
          airbitzAccount: {},
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          eth: '10',
          ethTokens: '11',
          rep: '12',
          isUnlocked: true
        };
        const stubbedGenerateDownloadAccountLink = sinon.stub();
        const stubbedOnAirBitzManageAccount = sinon.stub();

        LoginAccountRewireAPI.__Rewire__('generateDownloadAccountLink', stubbedGenerateDownloadAccountLink);
        LoginAccountRewireAPI.__Rewire__('getABCUIContext', stubbedGetABCUIContext);

        const actual = selectLoginAccount.resultFunc(loginAccount);

        const expected = {
          airbitzAccount: {},
          address: '0xAccountAddress',
          loginID: '123ThisIsALoginID',
          trimmedLoginID: '123T...inID',
          trimmedAddress: '0xAc...ress',
          linkText: '0xAc...ress',
          isUnlocked: true,
          rep: formatRep(12, { zeroStyled: false, decimalsRounded: 1 }),
          eth: formatEther(10, { zeroStyled: false, decimalsRounded: 2 }),
          ethTokens: formatEtherTokens(11, { zeroStyled: false, decimalsRounded: 2 })
        };

        assert.deepEqual(actual, expected, `didn't return the expected object`);
        assert(stubbedGenerateDownloadAccountLink.calledOnce, `didn't call 'generateDownloadAccountLink' once as expected`);

        LoginAccountRewireAPI.__ResetDependency__('generateDownloadAccountLink');

        done();
      }
    });
  });
});
