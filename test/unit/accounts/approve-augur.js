/* eslint-env mocha */

/**
 * Address: 0xa11ce
 * Auth: { privateKey: '0x0' }
 */


"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var proxyquire = require("proxyquire").noPreserveCache();
var constants = require("../../../src/constants");
var noop = require("../../../src/utils/noop");

describe("accounts/approve-augur", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var approveAugur = proxyquire("../../../src/accounts/approve-augur", {
        "../augur-node": Object.assign({}, t.mock.augurNode),
        "../api": function () { return Object.assign({}, t.mock.api); },
      });
      approveAugur(Object.assign({}, t.params, {
        onSent: noop,
        onSuccess: function (res) {
          t.assertions(null, res);
          done();
        },
        onFailed: function (err) {
          t.assertions(err);
          done();
        },
      }));
    });
  };
  test({
    description: "Should handle an account that needs to have approval",
    params: {
      address: "0xa11ce",
      meta: {
        privateKey: "0x0",
      },
    },
    mock: {
      augurNode: {
        getContractAddresses: function (cb) {
          cb(null, {
            addresses: {
              Augur: "0x0b0b",
            },
          });
        },
      },
      api: {
        Cash: {
          allowance: function (params, cb) {
            assert.deepEqual(params, {
              _owner: "0xa11ce",
              _spender: "0x0b0b",
            }, "Didn't call api.Cash.allowance with the expected params");
            cb(null, 0);
          },
          approve: function (params) {
            assert.deepEqual(params.meta, {
              privateKey: "0x0",
            }, "Didn't pass the expected meta value to Cash.approve");
            assert.deepEqual(params._spender, "0x0b0b", "Didn't pass the expected _spender value to Cash.approve");
            assert.deepEqual(params._value, constants.ETERNAL_APPROVAL_VALUE, "Didn't pass the expected _value to Cash.approve");
            params.onSuccess({ callReturn: "1" });
          },
        },
      },
    },
    assertions: function (err, res) {
      assert.isNull(err, "Expected to get null returned to the callback.");
      assert.deepEqual(res, { callReturn: "1" }, "didn't get the expected res value back from a successful call to Cash.approve");
    },
  });
  test({
    description: "Should handle an account that has approval",
    params: {
      address: "0xa11ce",
      meta: {
        privateKey: "0x0",
      },
    },
    mock: {
      augurNode: {
        getContractAddresses: function (cb) {
          cb(null, {
            addresses: {
              Augur: "0x0b0b",
            },
          });
        },
      },
      api: {
        Cash: {
          allowance: function (params, cb) {
            assert.deepEqual(params, {
              _owner: "0xa11ce",
              _spender: "0x0b0b",
            }, "Did not call api.Cash.allowance with the expected params");
            cb(null, new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16).toFixed());
          },
          approve: function () {
            // shouldn't be called, force a failure.
            assert.isNull("Should never be hit!", "api.Cash.approve was called when it shouldn't have been.");
          },
        },
      },
    },
    assertions: function (err) {
      assert.isNull(err, "Expected to get null returned to the callback.");
    },
  });
  test({
    description: "Should return an error object if one is returned from augurNode.getContractAddresses",
    params: {
      address: "0xa11ce",
      meta: {
        privateKey: "0x0",
      },
    },
    mock: {
      augurNode: {
        getContractAddresses: function (cb) {
          cb({ error: 100, message: "Uh-Oh!" });
        },
      },
      api: {
        Cash: {
          allowance: function () {
            // shouldn't be called, force a failure.
            assert.isNull("Should never be hit!", "api.Cash.allowance was called when it shouldn't have been.");
          },
          approve: function () {
            // shouldn't be called, force a failure.
            assert.isNull("Should never be hit!", "api.Cash.approve was called when it shouldn't have been.");
          },
        },
      },
    },
    assertions: function (err) {
      assert.deepEqual(err, { error: 100, message: "Uh-Oh!" }, "Didn't recieve the expected error object from a augurNode.getContractAddresses failure.");
    },
  });
  test({
    description: "Should handle an error from Cash.allowance",
    params: {
      address: "0xa11ce",
      meta: {
        privateKey: "0x0",
      },
    },
    mock: {
      augurNode: {
        getContractAddresses: function (cb) {
          cb(null, {
            addresses: {
              Augur: "0x0b0b",
            },
          });
        },
      },
      api: {
        Cash: {
          allowance: function (params, cb) {
            assert.deepEqual(params, {
              _owner: "0xa11ce",
              _spender: "0x0b0b",
            }, "Did not call api.Cash.allowance with the expected params");
            cb({ error: 100, message: "Uh-Oh!" });
          },
          approve: function () {
            // shouldn't be called, force a failure.
            assert.isNull("Should never be hit!", "api.Cash.approve was called when it should not have been.");
          },
        },
      },
    },
    assertions: function (err) {
      assert.deepEqual(err, { error: 100, message: "Uh-Oh!" }, "Did not recieve the expected error object from a Cash.allowance failure.");
    },
  });
  test({
    description: "Should handle an onFailed error from Cash.approve",
    params: {
      address: "0xa11ce",
      meta: {
        privateKey: "0x0",
      },
    },
    mock: {
      augurNode: {
        getContractAddresses: function (cb) {
          cb(null, {
            addresses: {
              Augur: "0x0b0b",
            },
          });
        },
      },
      api: {
        Cash: {
          allowance: function (params, cb) {
            assert.deepEqual(params, {
              _owner: "0xa11ce",
              _spender: "0x0b0b",
            }, "Did not call api.Cash.allowance with the expected params");
            cb(null, 0);
          },
          approve: function (params) {
            assert.deepEqual(params.meta, {
              privateKey: "0x0",
            }, "Did not pass the expected meta value to Cash.approve");
            assert.deepEqual(params._spender, "0x0b0b", "Did not pass the expected _spender value to Cash.approve");
            assert.deepEqual(params._value, constants.ETERNAL_APPROVAL_VALUE, "Did not pass the expected _value to Cash.approve");
            params.onFailed({ error: 100, message: "Uh-Oh!" });
          },
        },
      },
    },
    assertions: function (err) {
      assert.deepEqual(err, { error: 100, message: "Uh-Oh!" }, "Did not recieve the expected error object from a Cash.approve failure.");
    },
  });
});
