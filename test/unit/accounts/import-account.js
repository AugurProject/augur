/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var errors = require("ethrpc").errors;
var keythereum = require("keythereum");
var abi = require("augur-abi");
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");
var constants = require("../../../src/constants");
var importAccount = require("../../../src/accounts/import-account");

var keystore = {
  address: "289d485d9771714cce91d3393d764e1311907acc",
  crypto: {
    cipher: "aes-128-ctr",
    ciphertext: "faf32ca89d286b107f5e6d842802e05263c49b78d46eac74e6109e9a963378ab",
    cipherparams: {
      iv: "558833eec4a665a8c55608d7d503407d"
    },
    kdf: "scrypt",
    kdfparams: {
      dklen: 32,
      n: 8,
      p: 16,
      r: 8,
      salt: "d571fff447ffb24314f9513f5160246f09997b857ac71348b73e785aab40dc04"
    },
    mac: "21edb85ff7d0dab1767b9bf498f2c3cb7be7609490756bd32300bb213b59effe"
  },
  id: "3279afcf-55ba-43ff-8997-02dcc46a6525",
  version: 3
};

describe("accounts/import-account", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var importAccount = proxyquire("../../../src/accounts/import-account", {
        keythereum: Object.assign({}, keythereum, t.mock.keythereum)
      });
      importAccount(t.params, function (importedAccount) {
        t.assertions(importedAccount);
        done();
      });
    });
  };
  test({
    description: "Import an account",
    params: {
      password: "foobar",
      keystore: keystore
    },
    mock: {
      keythereum: {}
    },
    assertions: function (importedAccount) {
      var expectedAccount = {
        privateKey: Buffer.from("14a447d8d4c69714f8750e1688feb98857925e1fec6dee7c75f0079d10519d25", "hex"),
        derivedKey: Buffer.from("6149823a44b50a20e7d5a6d7e60798c576f330888a3c6bc0113da5b687662586", "hex"),
        address: "0x289d485d9771714cce91d3393d764e1311907acc",
        keystore: keystore
      };
      console.log("importedAccount:", importedAccount);
      console.log("expectedAccount:", expectedAccount);
      assert.deepEqual(importedAccount, expectedAccount);
    }
  });
  test({
    description: "Should handle an empty string password by returning an error",
    params: {
      p: {
        password: "",
        keystore: keystore
      },
      callback: noop
    },
    mock: {
      keythereum: {
        recover: function (passord, keystore, callback) {
          assert.fail();
        }
      }
    },
    assertions: function (importedAccount) {
      assert.deepEqual(importedAccount, errors.BAD_CREDENTIALS);
    }
  });
  test({
    description: "Should handle an issue recovering the privateKey by returning an error",
    params: {
      password: "foobar",
      keystore: keystore
    },
    mock: {
      keythereum: {
        recover: function (passord, keystore, callback) {
          callback({ error: "Uh-oh!" });
        }
      }
    },
    assertions: function (importedAccount) {
      assert.deepEqual(importedAccount, errors.BAD_CREDENTIALS);
    }
  });
  test({
    description: "Should handle an issue with derivedKey by returning an error",
    params: {
      password: "foobar",
      keystore: keystore
    },
    mock: {
      keythereum: {
        recover: function (passord, keystore, callback) {
          // don't call the real recover as it calls deriveKey within and we don't
          // want to call our mock early, we want to test a conditional failure
          // later in import-account.
          callback("A_PRIVATE_KEY");
        },
        deriveKey: function (password, salt, cipher, callback) {
          callback({ error: "Uh-Oh!" });
        }
      }
    },
    assertions: function (importAccount) {
      assert.deepEqual(importAccount, errors.BAD_CREDENTIALS);
    }
  });
});
