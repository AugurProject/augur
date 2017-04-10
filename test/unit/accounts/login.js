/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var keys = require("keythereum");
var errors = require("ethrpc").errors;
var noop = require("../../../src/utils/noop");
var login = require("../../../src/accounts/login");
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

describe("accounts/login", function () {
  var deriveKey = keys.deriveKey;
  var getMAC = keys.getMAC;
  var decrypt = keys.decrypt;
  afterEach(function () {
    keys.deriveKey = deriveKey;
    keys.getMAC = getMAC;
    keys.decrypt = decrypt;
  });
  var test = function (t) {
    it(t.description, function (done) {
      store.reset();
      keys.deriveKey = t.deriveKey || deriveKey;
      keys.getMAC = t.getMAC || getMAC;
      keys.decrypt = t.decrypt || decrypt;
      if (t.params.cb) {
        login(t.params.keystore, t.params.password, function (account) {
          t.assertions(account, store.getState());
          done();
        }); 
      } else {
        var account = login(t.params.keystore, t.params.password);
        t.assertions(account, store.getState());
        done();
      }
    });
  };
  test({
    description: "Should return an error on blank password",
    params: {
      keystore: keystore,
      password: "",
      cb: noop
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should return an error on undefined password, no callback",
    params: {
      keystore: keystore,
      password: undefined,
      cb: undefined
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should return an error on undefined loginID",
    params: {
      keystore: undefined,
      password: "foobar",
      cb: noop
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should return an error if keys.deriveKey returns an error object",
    params: {
      keystore: keystore,
      password: "foobar",
      cb: noop
    },
    deriveKey: function (password, salt, options, cb) {
      cb({error: "DeriveKey failed!"});
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should return an error if keys.getMAC does not match the ketstore.crypto.mac value",
    params: {
      keystore: keystore,
      password: "foobar",
      cb: noop
    },
    getMAC: function (derivedKey, storedKey) {
      return "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    },
    assertions: function (account, state) {
      assert.deepEqual(account, errors.BAD_CREDENTIALS);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should return an error if we fail to generate the privateKey and derivedKey will return a hex string instead of buffer",
    params: {
      keystore: keystore,
      password: "foobar",
      cb: noop
    },
    deriveKey: function (password, salt, options, cb) {
      cb("6149823a44b50a20e7d5a6d7e60798c576f330888a3c6bc0113da5b687662586");
    },
    decrypt: function (ciphertext, key, iv, algo) {
      throw new Error("Uh-Oh!");
    },
    assertions: function (account, state) {
      var expected = errors.BAD_CREDENTIALS;
      expected.bubble = new Error("Uh-Oh!");
      assert.deepEqual(account, expected);
      assert.deepEqual(state.activeAccount, {});
    }
  });
  test({
    description: "Should successfully login if given a valid keystore and password",
    params: {
      keystore: keystore,
      password: "foobar",
      cb: noop
    },
    assertions: function (account, state) {
      assert.deepEqual(state.activeAccount, account);
      assert.strictEqual(account.address, "0x289d485d9771714cce91d3393d764e1311907acc");
      assert.deepEqual(account.privateKey, Buffer.from("14a447d8d4c69714f8750e1688feb98857925e1fec6dee7c75f0079d10519d25", "hex"));
      assert.deepEqual(account.derivedKey, Buffer.from("8eb07bbcf844b11128fe6cb9556e3ce26ef781a19ef661fef8daa100953d3a53", "hex"));
      assert.deepEqual(account.keystore, keystore);
    }
  });
});
