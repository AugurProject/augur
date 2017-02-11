"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var errors = require("ethrpc").errors;

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
  // ? tests total
  before(function() {
    // run this one time before running any register tests.
    // make sure accounts is reset to default state.
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
  });
  afterEach(function() {
    augur.accounts.account = {};
  });
  var test = function(t) {
    it(t.description, function(done) {
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
});
describe("accounts.fundNewAccountFromFaucet", function() {});
describe("accounts.fundNewAccountFromAddress", function() {});
describe("accounts.changeAccountName", function() {});
describe("accounts.importAccount", function() {});
describe("accounts.setAccountObject", function() {});
describe("accounts.login", function() {});
describe("accounts.loginWithMasterKey", function() {});
describe("accounts.logout", function() {});
describe("accounts.submitTx", function() {});
describe("accounts.getTxNonce", function() {});
describe("accounts.invoke", function() {});
