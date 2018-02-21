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
var keythereum = require("keythereum");
var errors = require("ethrpc").errors;
var proxyquire = require("proxyquire").noPreserveCache();

var keystore = {
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

describe("accounts/login", function () {
  var test = function (t) {
    it(t.description, function (done) {
      this.timeout(60000);
      var login = proxyquire("../../../src/accounts/login", {
        keythereum: Object.assign({}, keythereum, t.mock.keythereum),
      });
      login(t.params, function (err, account) {
        if (err) {
          t.assertions(err);
        } else {
          t.assertions(account);
        }
        done();
      });
    });
  };
  test({
    description: "Should return an error on blank password",
    params: {
      keystore: keystore,
      password: "",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
    },
    mock: {
      keythereum: {},
    },
    assertions: function (account) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
    },
  });
  test({
    description: "Should return an error on undefined loginId",
    params: {
      keystore: undefined,
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
    },
    mock: {
      keythereum: {},
    },
    assertions: function (account) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
    },
  });
  test({
    description: "Should return an error if keys.deriveKey returns an error object",
    params: {
      keystore: keystore,
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
    },
    mock: {
      keythereum: {
        deriveKey: function (password, salt, options, cb) {
          cb({error: "DeriveKey failed!"});
        },
      },
    },
    assertions: function (account) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
    },
  });
  test({
    description: "Should return an error if keys.getMAC does not match the keystore.crypto.mac value",
    params: {
      keystore: keystore,
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
    },
    mock: {
      keythereum: {
        getMAC: function () {
          return "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
        },
      },
    },
    assertions: function (account) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
    },
  });
  test({
    description: "Should return an error if we fail to generate the privateKey and derivedKey will return a hex string instead of buffer",
    params: {
      keystore: keystore,
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
    },
    mock: {
      keythereum: {
        deriveKey: function (password, salt, options, cb) {
          cb("6149823a44b50a20e7d5a6d7e60798c576f330888a3c6bc0113da5b687662586");
        },
        decrypt: function () {
          throw new Error("Uh-Oh!");
        },
      },
    },
    assertions: function (account) {
      var expected = errors.BAD_CREDENTIALS;
      expected.bubble = new Error("Uh-Oh!");
      assert.deepEqual(account, expected);
    },
  });
  test({
    description: "Should successfully login if given a valid keystore and password",
    params: {
      keystore: keystore,
      password: "testpassword",
      address: "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b",
    },
    mock: {
      keythereum: {},
    },
    assertions: function (account) {
      assert.strictEqual(account.address, "0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b");
      assert.deepEqual(account.privateKey, Buffer.from("7a28b5ba57c53603b0b07b56bba752f7784bf506fa95edc395f5cf6c7514fe9d", "hex"));
      assert.deepEqual(account.derivedKey, Buffer.from("f06d69cdc7da0faffb1008270bca38f5e31891a3a773950e6d0fea48a7188551", "hex"));
      assert.deepEqual(account.keystore, keystore);
    },
  });
});
