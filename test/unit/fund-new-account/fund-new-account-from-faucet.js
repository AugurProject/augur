/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var pass = require("../../../src/utils/pass");
var fundNewAccountFromFaucet = require("../../../src/fund-new-account/fund-new-account-from-faucet");
var store = require("../../../src/store");
var Augur = require("../../../src");
var proxyquire = require("proxyquire").noCallThru().noPreserveCache();
var augur = new Augur();

describe("fund-new-account/fund-new-account-from-faucet", function () {
  var balance = augur.rpc.balance;
  var fundNewAccount = augur.fundNewAccount;
  var fastforward = augur.rpc.fastforward;
  var finished;
  var callCounts = {
    balance: 0,
    fastforward: 0
  };
  afterEach(function () {
    clearCallCounts(callCounts);
    augur.rpc.balance = balance;
    augur.fundNewAccount = fundNewAccount;
    augur.rpc.fastforward = fastforward;
  });
  var test = function (t) {
    it(t.description, function (done) {
      augur.rpc.balance = t.balance || balance;
      augur.fundNewAccount = t.fundNewAccount || fundNewAccount;
      augur.rpc.fastforward = t.fastforward || fastforward;

      finished = done;
      // before each test, call accounts module but replace request with our mock, then run the function exported from accounts with augur set as our this. finally call fundNewAccountFromFaucet to test.
      proxyquire('../../../src/fund-new-account', {
        'request': t.mockRequest
      }).call(augur).fundNewAccountFromFaucet(t.registeredAddress, t.branch, t.onSent, t.onSuccess, t.onFailed);
      // augur.fundNewAccount.fundNewAccountFromFaucet(t.registeredAddress, t.branch, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is null',
    registeredAddress: null,
    branch: '101010',
    onFailed: function (err) {
      assert.isNull(err);
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(new Error('this should never be hit in this example!'), null, null);
        };
      }
    }
  });
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is undefined',
    registeredAddress: undefined,
    branch: '101010',
    onFailed: function (err) {
      assert.isUndefined(err);
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(new Error('this should never be hit in this example!'), null, null);
        };
      }
    }
  });
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is not a string',
    registeredAddress: {},
    branch: '101010',
    onFailed: function (err) {
      assert.deepEqual(err, {});
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(new Error('this should never be hit in this example!'), null, null);
        };
      }
    }
  });
  test({
    description: 'If the request to the URL returns an error, pass the error to onFailed',
    registeredAddress: '0x1',
    branch: '101010',
    onFailed: function (err) {
      assert.deepEqual(err, new Error('Invalid URI "' + constants.FAUCET + '0x0000000000000000000000000000000000000001'));
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(new Error('Invalid URI "' + constants.FAUCET + '0x0000000000000000000000000000000000000001'), null, 'some responseBody, this doesnt matter for our test.');
        };
      }
    }
  });
  test({
    description: 'If the request to the URL returns a status not equal to 200',
    registeredAddress: '0x1',
    branch: '101010',
    onFailed: function (err) {
      assert.deepEqual(err, 404);
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(null, { statusCode: 404 }, 'some responseBody, this doesnt matter for our test.');
        };
      }
    }
  });
  test({
    description: 'If the request to the URL returns a status of 200, and augur.rpc.balance returns a number greater than 0 we call fundNewAccount',
    registeredAddress: '0x1',
    balance: function (address, cb) {
      callCounts.balance++;
      assert.deepEqual(address, '0x1');
      cb('1000');
    },
    fundNewAccount: function (arg) {
      assert.deepEqual(arg, {
        branch: constants.DEFAULT_BRANCH_ID,
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      });
      assert.deepEqual(callCounts, {
        balance: 1,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(null, { statusCode: 200 }, 'some responseBody, this doesnt matter for our test.');
        };
      }
    }
  });
  test({
    description: 'Should retry to fund account by fastforwarding through the blocks until we hit the most recent block and balance returns a value greater than 0',
    registeredAddress: '0x1',
    branch: '101010',
    onSent: pass,
    onSuccess: pass,
    onFailed: pass,
    balance: function (address, cb) {
      callCounts.balance++;
      assert.deepEqual(address, '0x1');
      switch(callCounts.balance) {
      case 5:
        cb('1000');
        break;
      default:
        cb('0');
        break;
      }
    },
    fastforward: function (blocks, cb) {
      callCounts.fastforward++;
      switch(callCounts.fastforward) {
      case 4:
        cb('101010');
        break;
      default:
        cb('101009');
        break;
      }
    },
    fundNewAccount: function (arg) {
      assert.deepEqual(arg, {
        branch: '101010',
        onSent: pass,
        onSuccess: pass,
        onFailed: pass
      });
      assert.deepEqual(callCounts, {
        balance: 5,
        fastforward: 4
      });
      finished();
    },
    mockRequest: {
      defaults: function () {
        // defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
        return function (url, cb) {
          // acts as our request() call in accounts
          // cb(err, response, body);
          cb(null, { statusCode: 200 }, 'some responseBody, this doesnt matter for our test.');
        };
      }
    }
  });
});
