"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var errors = require("ethrpc").errors;
var keys = require("keythereum");
var constants = require("../../../src/constants");

var accounts = [{
    loginID: undefined,
    name: 'account1',
    address: undefined,
    password: 'helloWorld',
    keystore: undefined,
    privateKey: undefined,
    derivedKey: undefined
  }, {
    loginID: undefined,
    name: 'account2',
    address: undefined,
    password: 'password',
    keystore: undefined,
    privateKey: undefined,
    derivedKey: undefined
  }];

describe("accounts.register", function() {
  // 8 tests total
  var create = keys.create;
  var deriveKey = keys.deriveKey;
  var KDF = constants.KDF;
  accounts = [{
      loginID: undefined,
      name: 'account1',
      address: undefined,
      password: 'helloWorld',
      keystore: undefined,
      privateKey: undefined,
      derivedKey: undefined
    }, {
      loginID: undefined,
      name: 'account2',
      address: undefined,
      password: 'password',
      keystore: undefined,
      privateKey: undefined,
      derivedKey: undefined
  }];
  afterEach(function() {
    augur.accounts.account = {};
    keys.create = create;
    keys.deriveKey = deriveKey;
    constants.KDF = KDF;
  });
  var test = function(t) {
    it(t.description, function(done) {
      keys.create = t.create || create;
      keys.deriveKey = t.deriveKey || deriveKey;
      constants.KDF = t.KDF || KDF;

      augur.accounts.register(t.name, t.password, function(result) {
        t.assertions(result);
        done();
      });
    });
  };
  test({
    description: 'should return an error if the password is < 6 characters long',
    name: 'testName1',
    password: 'pass',
    assertions: function(result) {
      assert.deepEqual(result, errors.PASSWORD_TOO_SHORT);
    }
  });
  test({
    description: 'should return an error if the password is undefined',
    name: 'testName1',
    password: undefined,
    assertions: function(result) {
      assert.deepEqual(result, errors.PASSWORD_TOO_SHORT);
    }
  });
  test({
    description: 'should return an error if there is an issue creating the private key',
    name: 'testname1',
    password: 'somevalidpassword',
    create: function(params, cb) {
      cb({error: 999, message: 'Uh-Oh!'});
    },
    assertions: function(result) {
      assert.deepEqual(result, {error: 999, message: 'Uh-Oh!'});
    }
  });
  test({
    description: 'should return an error if there is an issue deriving the secret key',
    name: 'testname1',
    password: 'somevalidpassword',
    deriveKey: function(password, salt, options, cb) {
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    assertions: function(result) {
      assert.deepEqual(result, {error: 999, message: 'Uh-Oh!'});
    }
  });
  test({
    description: 'should register an account given a valid name and password - account 1',
    name: accounts[0].name,
    password: accounts[0].password,
    assertions: function(result) {
      assert.equal(result.name, 'account1');
      assert.isString(result.loginID);
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));

      assert.deepEqual(result, augur.accounts.account);

      accounts[0].address = result.address;
      accounts[0].loginID = result.loginID;
      accounts[0].privateKey = result.privateKey;
      accounts[0].keystore = result.keystore;
      accounts[0].derivedKey = result.derivedKey;
    }
  });
  test({
    description: 'should register an account given a valid name and password - account 2',
    name: accounts[1].name,
    password: accounts[1].password,
    assertions: function(result) {
      assert.equal(result.name, 'account2');
      assert.isString(result.loginID);
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));

      assert.deepEqual(result, augur.accounts.account);

      accounts[1].address = result.address;
      accounts[1].loginID = result.loginID;
      accounts[1].privateKey = result.privateKey;
      accounts[1].keystore = result.keystore;
      accounts[1].derivedKey = result.derivedKey;
    }
  });
  test({
    description: 'should register an account given a valid name and password, should handle pbkdf2',
    name: 'testAccountName1',
    password: 'thisisavalidpassword',
    KDF: 'pbkdf2',
    assertions: function(result) {
      assert.equal(result.name, 'testAccountName1');
      assert.isString(result.loginID);
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, augur.accounts.account);
    }
  });
  test({
    description: 'should register an account given a valid name and password but derived key returns a hex string',
    name: 'testAccountName1',
    password: 'thisisavalidpassword',
    deriveKey: function(password, salt, options, cb) {
      // we are going to use our mock function to call the original function. However we need to apply keys as the this inside of the original function as it's not attached the the original keys object anymore. We do this to be able to pass a hex string version of derivedKey. This is to check the if statement that converts the derivedKey to a buffer if it isn't already.
      deriveKey.apply(keys, [password, salt, options, function(derivedKey) {
        cb(derivedKey.toString('hex'));
      }]);
    },
    assertions: function(result) {
      assert.equal(result.name, 'testAccountName1');
      assert.isString(result.loginID);
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, augur.accounts.account);
    }
  });
});
describe("accounts.fundNewAccountFromFaucet", function() {});
describe("accounts.fundNewAccountFromAddress", function() {});
describe("accounts.changeAccountName", function() {});
describe("accounts.importAccount", function() {});
describe("accounts.loadLocalLoginAccount", function() {});
describe("accounts.login", function() {});
describe("accounts.loginWithMasterKey", function() {});
describe("accounts.logout", function() {});
describe("accounts.submitTx", function() {});
describe("accounts.getTxNonce", function() {});
describe("accounts.invoke", function() {});
