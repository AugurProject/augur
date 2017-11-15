/* eslint-env mocha */

/**
 * Test vectors: https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 * Address: 008aeeda4d805471df9b2a5b0f38a0c3bcba786b
 * Password: testpassword
 * Private key: 7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d
 * Derived keys:
 *  - PBKDF2: f06d69cdc7da0faffb1008270bca38f5e31891a3a773950e6d0fea48a7188551
 *  - scrypt: fac192ceb5fd772906bea3e118a69e8bbb5cc24229e20d8766fd298291bba6bd
 */

"use strict";

var assert = require("chai").assert;
var errors = require("ethrpc").errors;
var keythereum = require("keythereum");
var proxyquire = require("proxyquire").noPreserveCache();

var scryptKeystore = {
  crypto: {
    cipher: "aes-128-ctr",
    cipherparams: {
      iv: "83dbcc02d8ccb40e466191a123791e0e",
    },
    ciphertext: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
    kdf: "scrypt",
    kdfparams: {
      dklen: 32,
      n: 262144,
      r: 1,
      p: 8,
      salt: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19",
    },
    mac: "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097",
  },
  id: "3198bc9c-6672-5ab3-d995-4942343ae5b6",
  version: 3,
};
var pbkdf2Keystore = {
  crypto: {
    cipher: "aes-128-ctr",
    cipherparams: {
      iv: "6087dab2f9fdbbfaddc31a909735c1e6",
    },
    ciphertext: "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46",
    kdf: "pbkdf2",
    kdfparams: {
      c: 262144,
      dklen: 32,
      prf: "hmac-sha256",
      salt: "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd",
    },
    mac: "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2",
  },
  id: "3198bc9c-6672-5ab3-d995-4942343ae5b6",
  version: 3,
};

describe("accounts/import-account", function () {
  var test = function (t) {
    it(t.description, function (done) {
      this.timeout(60000);
      var importAccount = proxyquire("../../../src/accounts/import-account", {
        keythereum: Object.assign({}, keythereum, t.mock.keythereum),
      });
      importAccount(t.params, function (err, importedAccount) {
        if (err) {
          t.assertions(err);
        } else {
          t.assertions(importedAccount);
        }
        done();
      });
    });
  };
  test({
    description: "Import an account with scrypt-derived secret key",
    params: {
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
      keystore: scryptKeystore,
    },
    mock: {
      keythereum: {},
    },
    assertions: function (importedAccount) {
      assert.deepEqual(importedAccount, {
        privateKey: Buffer.from("7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d", "hex"),
        derivedKey: Buffer.from("fac192ceb5fd772906bea3e118a69e8bbb5cc24229e20d8766fd298291bba6bd", "hex"),
        address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
        keystore: scryptKeystore,
      });
    },
  });
  test({
    description: "Import an account with PBKDF2-derived secret key",
    params: {
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
      keystore: pbkdf2Keystore,
    },
    mock: {
      keythereum: {},
    },
    assertions: function (importedAccount) {
      assert.deepEqual(importedAccount, {
        privateKey: Buffer.from("7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d", "hex"),
        derivedKey: Buffer.from("f06d69cdc7da0faffb1008270bca38f5e31891a3a773950e6d0fea48a7188551", "hex"),
        address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
        keystore: pbkdf2Keystore,
      });
    },
  });
  test({
    description: "Should handle an empty string password by returning an error",
    params: {
      p: {
        password: "",
        keystore: scryptKeystore,
      },
    },
    mock: {
      keythereum: {
        recover: function () {
          assert.fail();
        },
      },
    },
    assertions: function (importedAccount) {
      assert.deepEqual(importedAccount, errors.BAD_CREDENTIALS);
    },
  });
  test({
    description: "Should handle an issue recovering the privateKey by returning an error",
    params: {
      password: "foobar",
      keystore: scryptKeystore,
    },
    mock: {
      keythereum: {
        recover: function (password, keystore, callback) {
          callback({ error: "Uh-oh!" });
        },
      },
    },
    assertions: function (importedAccount) {
      assert.deepEqual(importedAccount, errors.BAD_CREDENTIALS);
    },
  });
  test({
    description: "Should handle an issue with derivedKey by returning an error",
    params: {
      password: "foobar",
      keystore: scryptKeystore,
    },
    mock: {
      keythereum: {
        recover: function (password, keystore, callback) {
          // don't call the real recover as it calls deriveKey within and we don't
          // want to call our mock early, we want to test a conditional failure
          // later in import-account.
          callback("A_PRIVATE_KEY");
        },
        deriveKey: function (password, salt, cipher, callback) {
          callback({ error: "Uh-Oh!" });
        },
      },
    },
    assertions: function (importAccount) {
      assert.deepEqual(importAccount, errors.BAD_CREDENTIALS);
    },
  });
});
