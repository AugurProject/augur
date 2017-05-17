/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var pass = require("../../../src/utils/pass");
var fundNewAccountFromFaucet = require("../../../src/beta/fund-new-account-from-faucet");
var constants = require("../../../src/constants");
var noop = require("../../../src/utils/noop");
var isFunction = require("../../../src/utils/is-function");
var Augur = require("../../../src");
var clearCallCounts = require("../../tools").clearCallCounts;
var proxyquire = require("proxyquire").noCallThru().noPreserveCache();
var augur = new Augur();

describe("beta/fund-new-account-from-faucet", function () {
  var getBalance = augur.rpc.getBalance;
  var fundNewAccount = augur.api.Faucets.fundNewAccount;
  var waitForNextBlocks = augur.rpc.waitForNextBlocks;
  var finished;
  var callCounts = {
    balance: 0,
    waitForNextBlocks: 0
  };
  afterEach(function () {
    clearCallCounts(callCounts);
    augur.rpc.getBalance = getBalance;
    augur.api.Faucets.fundNewAccount = fundNewAccount;
    augur.rpc.waitForNextBlocks = waitForNextBlocks;
  });
  var test = function (t) {
    it(t.description, function (done) {
      var fundNewAccountFromFaucet;
      augur.rpc.getBalance = t.getBalance || getBalance;
      augur.api.Faucets.fundNewAccount = t.fundNewAccount || fundNewAccount;
      augur.rpc.waitForNextBlocks = t.waitForNextBlocks || waitForNextBlocks;
      finished = done;

      // before each test, call accounts module but replace request with our mock, then run the function exported from accounts with augur set as our this. finally call fundNewAccountFromFaucet to test.
      fundNewAccountFromFaucet = proxyquire("../../../src/beta/fund-new-account-from-faucet", {
        "request": t.mockRequest,
        "browser-request": t.mockRequest
      }).bind(augur);
      fundNewAccountFromFaucet(t.params);
    });
  };
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is null',
    params: {
      registeredAddress: null,
      branch: '101010',
      onFailed: function (err) {
        assert.isNull(err);
        assert.deepEqual(callCounts, {
          balance: 0,
          waitForNextBlocks: 0
        });
        finished();
      },
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
    params: {
      registeredAddress: undefined,
      branch: '101010',
      onFailed: function (err) {
        assert.isUndefined(err);
        assert.deepEqual(callCounts, {
          balance: 0,
          waitForNextBlocks: 0
        });
        finished();
      },
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
    params: {
      registeredAddress: {},
      branch: '101010',
      onFailed: function (err) {
        assert.deepEqual(err, {});
        assert.deepEqual(callCounts, {
          balance: 0,
          waitForNextBlocks: 0
        });
        finished();
      },
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
    params: {
      registeredAddress: '0x1',
      branch: '101010',
      onFailed: function (err) {
        assert.deepEqual(err, new Error('Invalid URI "' + constants.FAUCET + '0x0000000000000000000000000000000000000001'));
        assert.deepEqual(callCounts, {
          balance: 0,
          waitForNextBlocks: 0
        });
        finished();
      },
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
    params: {
      registeredAddress: '0x1',
      branch: '101010',
      onFailed: function (err) {
        assert.deepEqual(err, 404);
        assert.deepEqual(callCounts, {
          balance: 0,
          waitForNextBlocks: 0
        });
        finished();
      },
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
    params: {
      registeredAddress: '0x1',
    },
    getBalance: function (address, cb) {
      callCounts.balance++;
      assert.deepEqual(address, '0x1');
      cb('1000');
    },
    fundNewAccount: function (arg) {
      assert.deepEqual(arg, {
        registeredAddress: '0x1',
        branch: constants.DEFAULT_BRANCH_ID,
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      });
      assert.deepEqual(callCounts, {
        balance: 1,
        waitForNextBlocks: 0
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
    description: 'Should retry to fund account by waitForNextBlocksing through the blocks until we hit the most recent block and balance returns a value greater than 0',
    params: {
      registeredAddress: '0x1',
      branch: '101010',
      onSent: pass,
      onSuccess: pass,
      onFailed: pass,
    },
    getBalance: function (address, cb) {
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
    waitForNextBlocks: function (blocks, cb) {
      callCounts.waitForNextBlocks++;
      switch(callCounts.waitForNextBlocks) {
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
        registeredAddress: '0x1',
        branch: '101010',
        onSent: pass,
        onSuccess: pass,
        onFailed: pass
      });
      assert.deepEqual(callCounts, {
        balance: 5,
        waitForNextBlocks: 4
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
