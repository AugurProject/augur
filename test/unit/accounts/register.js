/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var errors = require("ethrpc").errors;
var keys = require("keythereum");
var abi = require("augur-abi");
var constants = require("../../../src/constants");
var register = require("../../../src/accounts/register");
var store = require("../../../src/store");

describe("accounts/register", function () {
  var create = keys.create;
  var deriveKey = keys.deriveKey;
  var KDF = constants.KDF;
  var test = function (t) {
    it(t.description, function (done) {
      store.dispatch({ type: "RESET_STATE" });
      keys.create = t.create || create;
      keys.deriveKey = t.deriveKey || deriveKey;
      constants.KDF = t.KDF || KDF;
      register(t.password, function (result) {
        t.assertions(result, store.getState());
        keys.create = create;
        keys.deriveKey = deriveKey;
        constants.KDF = KDF;
        done();
      });
    });
  };
  test({
    description: "should return an error if the password is < 6 characters long",
    password: "pass",
    assertions: function (result, state) {
      assert.deepEqual(result, errors.PASSWORD_TOO_SHORT);
      assert.deepEqual({}, state.activeAccount);
    }
  });
  test({
    description: "should return an error if the password is undefined",
    password: undefined,
    assertions: function (result, state) {
      assert.deepEqual(result, errors.PASSWORD_TOO_SHORT);
      assert.deepEqual({}, state.activeAccount);
    }
  });
  test({
    description: "should return an error if there is an issue creating the private key",
    password: "somevalidpassword",
    create: function (params, cb) {
      cb({error: 999, message: "Uh-Oh!"});
    },
    assertions: function (result, state) {
      assert.deepEqual(result, {error: 999, message: "Uh-Oh!"});
      assert.deepEqual({}, state.activeAccount);
    }
  });
  test({
    description: "should return an error if there is an issue deriving the secret key",
    password: "somevalidpassword",
    deriveKey: function (password, salt, options, cb) {
      cb({ error: 999, message: "Uh-Oh!" });
    },
    assertions: function (result, state) {
      assert.deepEqual(result, {error: 999, message: "Uh-Oh!"});
      assert.deepEqual({}, state.activeAccount);
    }
  });
  test({
    description: "should register an account given a valid password - account 1",
    password: "testpassword1",
    assertions: function (result, state) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert.isTrue(Buffer.isBuffer(result.privateKey));
      assert.isTrue(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, state.activeAccount);
    }
  });
  test({
    description: "should register an account given a valid password - account 2",
    password: "testpassword2",
    assertions: function (result, state) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert.isTrue(Buffer.isBuffer(result.privateKey));
      assert.isTrue(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, state.activeAccount);
    }
  });
  test({
    description: "should register an account given a valid password, should handle pbkdf2 KDF",
    password: "thisisavalidpassword",
    KDF: "pbkdf2",
    assertions: function (result, state) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert.isTrue(Buffer.isBuffer(result.privateKey));
      assert.isTrue(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, state.activeAccount);
    }
  });
  test({
    description: "should register an account given a valid password, should handle scrypt KDF",
    password: "thisisavalidpassword",
    KDF: "scrypt",
    assertions: function (result, state) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert.isTrue(Buffer.isBuffer(result.privateKey));
      assert.isTrue(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, state.activeAccount);
    }
  });
});
