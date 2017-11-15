/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var keys = require("keythereum");
var sha256 = require("../../../src/utils/sha256");
var loginWithMasterKey = require("../../../src/accounts/login-with-master-key");

var privateKey = "1000000000000000000000000000000000000000000000000000000000000000";

describe("accounts/login-with-master-key", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(loginWithMasterKey(t.params));
    });
  };
  test({
    description: "Should handle logging into an account using a privateKey buffer",
    params: {
      privateKey: Buffer.from(privateKey, "hex"),
    },
    assertions: function (account) {
      assert.deepEqual(account, {
        address: speedomatic.formatEthereumAddress(keys.privateKeyToAddress(privateKey)),
        privateKey: Buffer.from(privateKey, "hex"),
        derivedKey: Buffer.from(speedomatic.unfork(sha256(Buffer.from(privateKey, "hex"))), "hex"),
      });
    },
  });
  test({
    description: "Should handle logging into an account using a privateKey hex string",
    params: {
      privateKey: privateKey,
    },
    assertions: function (account) {
      assert.deepEqual(account, {
        address: speedomatic.formatEthereumAddress(keys.privateKeyToAddress(privateKey)),
        privateKey: Buffer.from(privateKey, "hex"),
        derivedKey: Buffer.from(speedomatic.unfork(sha256(Buffer.from(privateKey, "hex"))), "hex"),
      });
    },
  });
});
