/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var keys = require("keythereum");
var sha256 = require("../../../src/utils/sha256");
var loginWithMasterKey = require("../../../src/accounts/login-with-master-key");
var store = require("../../../src/store");

var privateKey = "1000000000000000000000000000000000000000000000000000000000000000";

describe("accounts/login-with-master-key", function () {
  var test = function (t) {
    it(t.description, function () {
      store.dispatch({type: "RESET_STATE"});
      loginWithMasterKey(t.privateKey, function (account) {
        t.assertions(account, store.getState());
      });
    });
  };
  test({
    description: "Should handle logging into an account using a privateKey buffer",
    privateKey: Buffer.from(privateKey, "hex"),
    assertions: function (account, state) {
      assert.deepEqual(account, {
        address: abi.format_address(keys.privateKeyToAddress(privateKey)),
        privateKey: Buffer.from(privateKey, "hex"),
        derivedKey: Buffer.from(abi.unfork(sha256(Buffer.from(privateKey, "hex"))), "hex")
      });
      assert.deepEqual(account, state.activeAccount);
    }
  });
  test({
    description: "Should handle logging into an account using a privateKey hex string",
    privateKey: privateKey,
    assertions: function (account, state) {
      assert.deepEqual(account, {
        address: abi.format_address(keys.privateKeyToAddress(privateKey)),
        privateKey: Buffer.from(privateKey, "hex"),
        derivedKey: Buffer.from(abi.unfork(sha256(Buffer.from(privateKey, "hex"))), "hex")
      });
      assert.deepEqual(account, state.activeAccount);
    }
  });
});
