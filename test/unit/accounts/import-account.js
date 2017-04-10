/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var errors = require("ethrpc").errors;
var keys = require("keythereum");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var constants = require("../../../src/constants");
var noop = require("../../../src/utils/noop");
var importAccount = require("../../../src/accounts/import-account");
var store = require("../../../src/store");

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
  var recover = keys.recover;
  var deriveKey = keys.deriveKey;
  afterEach(function () {
    keys.recover = recover;
    keys.deriveKey = deriveKey;
  });
  var test = function (t) {
    it(t.description, function (done) {
      store.reset();
      keys.recover = t.recover || recover;
      keys.deriveKey = t.deriveKey || deriveKey;
      if (t.params.cb) {
        importAccount(t.params.password, t.params.keystore, function (account) {
          t.assertions(account, store.getState());
          done();
        });
      } else {
        var output = importAccount(t.params.password, t.params.keystore);
        t.assertions(output, store.getState());
        done();
      }
    });
  };
  test({
    description: "Should handle importing an account",
    params: {
      password: "foobar",
      keystore: keystore,
      cb: noop
    },
    assertions: function (account, state) {
      var expected = {
        privateKey: Buffer.from("14a447d8d4c69714f8750e1688feb98857925e1fec6dee7c75f0079d10519d25", "hex"),
        derivedKey: Buffer.from("6149823a44b50a20e7d5a6d7e60798c576f330888a3c6bc0113da5b687662586", "hex"),
        address: "0x289d485d9771714cce91d3393d764e1311907acc",
        keystore: keystore
      };
      assert.deepEqual(account, expected);
      assert.deepEqual(state.activeAccount, expected);
    }
  });
  test({
    description: "Should handle no cb and blank password by returning an error",
    params: {
      password: "",
      keystore: keystore
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should handle an issue recovering the privateKey by returning an error",
    params: {
      password: "foobar",
      keystore: keystore,
      cb: noop
    },
    recover: function (password, keystore, cb) {
      cb({error: "Uh-Oh!"});
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
});
