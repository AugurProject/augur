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
describe("accounts.changeAccountName", function() {
  // 2 tests total
  augur.accounts.account = {};
  afterEach(function() {
    augur.accounts.account = {};
  });
  var test = function(t) {
    it(t.description, function() {
      augur.accounts.account = t.account;
      var out = augur.accounts.changeAccountName(t.newName, t.cb);
      t.assertions(out);
    });
  };
  test({
    description: 'Should change the name value of the logged in account',
    account: { name: 'hello' },
    newName: 'world',
    cb: function(name) {
      assert.deepEqual(name, { name: 'world' });
    },
    assertions: function(out) {
      // out is undefined in this test since we gave a callback.
      assert.isUndefined(out);
      assert.deepEqual(augur.accounts.account, { name: 'world' });
    }
  });
  test({
    description: 'Should change the name value of the logged in account',
    account: { name: 'world' },
    newName: 'hello',
    cb: undefined,
    assertions: function(out) {
      // since we pass cb as undefined it should use utils.pass which simply passes the value passed to callback out as a return value, so out should be populated with our new augur.accounts.account object.
      assert.deepEqual(out, { name: 'hello' });
      assert.deepEqual(augur.accounts.account, out);
    }
  });
});
describe("accounts.importAccount", function() {});
describe("accounts.loadLocalLoginAccount", function() {
  // 7 tests total
  augur.accounts.account = {};
  afterEach(function() {
    augur.accounts.account = {};
  });
  var test = function(t) {
    it(t.description, function() {
      var loginAccount = t.prepareLoginAccount(accounts);
      var out = augur.accounts.loadLocalLoginAccount(loginAccount, t.cb);
      t.assertions(out, loginAccount);
    });
  };
  test({
    description: 'Should login an account when given a loginAccount object where all values are as expected',
    prepareLoginAccount: function(accounts) {
      // we have to do it this way to get accounts at run time, if we try and just pass loginAccount as an object then we will be using accounts above with most values = undefined.
      return {
        name: accounts[0].name,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey,
        loginID: accounts[0].loginID,
        keystore: accounts[0].keystore
      };
    },
    cb: function(account) {
      assert.deepEqual(account.name, accounts[0].name);
      assert.deepEqual(account.loginID, accounts[0].loginID);
      assert.deepEqual(account.address, accounts[0].address);
      assert.deepEqual(account.derivedKey, accounts[0].derivedKey);
      assert.deepEqual(account.privateKey, accounts[0].privateKey);
      assert.deepEqual(account.keystore, accounts[0].keystore);
    },
    assertions: function(out, loginAccount) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
      assert.deepEqual(loginAccount, augur.accounts.account);
    }
  });
  test({
    description: 'Should login an account when given a loginAccount object where there is no cb provided and privateKey and DerivedKey are both hex strings.',
    prepareLoginAccount: function(accounts) {
      // see first test for explaination of this func
      return {
        name: accounts[0].name,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey.toString('hex'),
        derivedKey: accounts[0].derivedKey.toString('hex'),
        loginID: accounts[0].loginID,
        keystore: accounts[0].keystore
      };
    },
    cb: undefined,
    assertions: function(out, loginAccount) {
      // because we didn't pass a cb then out should be defined as the account and out should = the currently logged in account
      loginAccount.privateKey = new Buffer(loginAccount.privateKey, "hex");
      loginAccount.derivedKey = new Buffer(loginAccount.derivedKey, "hex");
      assert.deepEqual(out, loginAccount);
      assert.deepEqual(out, augur.accounts.account);
      assert.deepEqual(loginAccount, augur.accounts.account);
    }
  });
  test({
    description: 'Should error if loginAccount is undefined',
    prepareLoginAccount: function(accounts) {
      //  see first test for explaination of this func
      return undefined;
    },
    cb: function(account) {
      assert.deepEqual(account, 'no response or bad input');
    },
    assertions: function(out, loginAccount) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
      assert.isUndefined(loginAccount);
    }
  });
  test({
    description: 'Should error if loginAccount is missing a loginID',
    prepareLoginAccount: function(accounts) {
      //  see first test for explaination of this func
      return {
        name: accounts[0].name,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey,
        keystore: accounts[0].keystore
      };
    },
    cb: function(account) {
      assert.deepEqual(account, 'no response or bad input');
    },
    assertions: function(out, loginAccount) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
      assert.deepEqual(loginAccount, {
        name: accounts[0].name,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey,
        keystore: accounts[0].keystore
      });
    }
  });
  test({
    description: 'Should error if loginAccount is missing a privateKey',
    prepareLoginAccount: function(accounts) {
      //  see first test for explaination of this func
      return {
        name: accounts[0].name,
        loginID: accounts[0].loginID,
        address: accounts[0].address,
        derivedKey: accounts[0].derivedKey,
        keystore: accounts[0].keystore
      };
    },
    cb: function(account) {
      assert.deepEqual(account, 'no response or bad input');
    },
    assertions: function(out, loginAccount) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
      assert.deepEqual(loginAccount, {
        name: accounts[0].name,
        loginID: accounts[0].loginID,
        address: accounts[0].address,
        derivedKey: accounts[0].derivedKey,
        keystore: accounts[0].keystore
      });
    }
  });
  test({
    description: 'Should error if loginAccount is missing a derivedKey',
    prepareLoginAccount: function(accounts) {
      //  see first test for explaination of this func
      return {
        name: accounts[0].name,
        loginID: accounts[0].loginID,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        keystore: accounts[0].keystore
      };
    },
    cb: function(account) {
      assert.deepEqual(account, 'no response or bad input');
    },
    assertions: function(out, loginAccount) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
      assert.deepEqual(loginAccount, {
        name: accounts[0].name,
        loginID: accounts[0].loginID,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        keystore: accounts[0].keystore
      });
    }
  });
  test({
    description: 'Should error if loginAccount is missing a keystore',
    prepareLoginAccount: function(accounts) {
      //  see first test for explaination of this func
      return {
        name: accounts[0].name,
        loginID: accounts[0].loginID,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey
      };
    },
    cb: function(account) {
      assert.deepEqual(account, 'no response or bad input');
    },
    assertions: function(out, loginAccount) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
      assert.deepEqual(loginAccount, {
        name: accounts[0].name,
        loginID: accounts[0].loginID,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey
      });
    }
  });
});
describe("accounts.login", function() {});
describe("accounts.loginWithMasterKey", function() {});
describe("accounts.logout", function() {});
describe("accounts.submitTx", function() {});
describe("accounts.getTxNonce", function() {});
describe("accounts.invoke", function() {});
