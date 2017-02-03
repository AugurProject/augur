"use strict";

var assert = require('chai').assert;
var augur = require('../../../src');
var errors = require("ethrpc").errors;
var keys = require("keythereum");
var constants = require("../../../src/constants");
var utils = require("../../../src/utilities");
var abi = require('augur-abi');

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
describe("accounts.fundNewAccountFromAddress", function() {
  // 3 tests total
  var sendEther = augur.rpc.sendEther;
  var fundNewAccount = augur.fundNewAccount;
  afterEach(function() {
    augur.rpc.sendEther = sendEther;
    augur.fundNewAccount = fundNewAccount;
  });
  var test = function(t) {
    it(t.description, function() {
      augur.rpc.sendEther = t.sendEther;
      augur.fundNewAccount = t.fundNewAccount;

      augur.accounts.fundNewAccountFromAddress(t.fromAddress, t.amount, t.registeredAddress, t.branch, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: 'Should handle an error from rpc.sendEther',
    fromAddress: '0x1',
    amount: '10',
    registeredAddress: '0x2',
    branch: '101010',
    onSent: function() {},
    onSuccess: function() {},
    onFailed: function(err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
    },
    sendEther: function(tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, utils.noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    fundNewAccount: function(tx) {
      // shouldn't be called.
      assert.isFalse(true);
    }
  });
  test({
    description: 'Should pass args to sendEther and then call fundNewAccount on success',
    fromAddress: '0x1',
    amount: '10',
    registeredAddress: '0x2',
    branch: '101010',
    onSent: undefined,
    onSuccess: undefined,
    onFailed: undefined,
    sendEther: function(tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, utils.noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onSuccess({ callReturn: '1', txHash: '0x3'});
    },
    fundNewAccount: function(tx) {
      assert.deepEqual(tx, {
        branch: '101010',
        onSent: utils.noop,
        onSuccess: utils.noop,
        onFailed: utils.noop
      });
    }
  });
  test({
    description: 'Should pass args to sendEther and then call fundNewAccount on success, if no branch passed, should default to default banch',
    fromAddress: '0x1',
    amount: '10',
    registeredAddress: '0x2',
    branch: undefined,
    onSent: undefined,
    onSuccess: undefined,
    onFailed: undefined,
    sendEther: function(tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, utils.noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onSuccess({ callReturn: '1', txHash: '0x3'});
    },
    fundNewAccount: function(tx) {
      assert.deepEqual(tx, {
        branch: constants.DEFAULT_BRANCH_ID,
        onSent: utils.noop,
        onSuccess: utils.noop,
        onFailed: utils.noop
      });
    }
  });
});
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
describe("accounts.importAccount", function() {
  // 4 tests total
  var recover = keys.recover;
  var deriveKey = keys.deriveKey;
  var keystore = {};
  var finished;
  afterEach(function() {
    augur.accounts.account = {};
    keys.recover = recover;
    keys.deriveKey = deriveKey;
  });
  var test = function(t) {
    it(t.description, function(done) {
      keys.recover = t.recover || recover;
      keys.deriveKey = t.deriveKey || deriveKey;
      keystore = t.prepareKeystore(accounts);
      finished = done;
      var out = augur.accounts.importAccount(t.name, t.password, keystore, t.cb);

      t.assertions(out);
    });
  };
  test({
    description: 'Should handle importing an account',
    name: 'AwesomeTestAccount',
    password: accounts[0].password,
    prepareKeystore: function(accounts) {
      return accounts[0].keystore;
    },
    cb: function(account) {
      assert.deepEqual(account, {
        name: 'AwesomeTestAccount',
        loginID: accounts[0].loginID,
        privateKey: accounts[0].privateKey,
        address: abi.format_address(accounts[0].address),
        keystore: accounts[0].keystore,
        derivedKey: accounts[0].derivedKey
      });
      assert.deepEqual(augur.accounts.account, account);
      finished();
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should handle no cb and blank password by returning an error',
    name: 'AwesomeTestAccount',
    password: '',
    prepareKeystore: function(accounts) {
      return accounts[0].keystore;
    },
    cb: undefined,
    assertions: function(out) {
      assert.deepEqual(out, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    }
  });
  test({
    description: 'Should handle an issue recovering the privateKey by returning an error',
    name: 'AwesomeTestAccount',
    password: accounts[0].password,
    prepareKeystore: function(accounts) {
      return accounts[0].keystore;
    },
    recover: function(password, keystore, cb) {
      cb({ error: 'Uh-Oh!' });
    },
    cb: function(account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should handle an issue deriving the derivedKey by returning an error',
    name: 'AwesomeTestAccount',
    password: accounts[0].password,
    prepareKeystore: function(accounts) {
      return accounts[0].keystore;
    },
    recover: function(password, keystore, cb) {
      // because recover calls deriveKey we need to mock it for this test as well and just return the privateKey it would return anyway...
      cb(accounts[0].privateKey);
    },
    deriveKey: function(password, salt, iv, cb) {
      cb({ error: 'Uh-Oh!' });
    },
    cb: function(account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
});
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
      t.assertions(out);
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
      assert.deepEqual(account, augur.accounts.account);
    },
    assertions: function(out) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
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
    assertions: function(out) {
      // because we didn't pass a cb then out should be defined as the account and out should = the currently logged in account
      assert.deepEqual(out, {
        name: accounts[0].name,
        address: accounts[0].address,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey,
        loginID: accounts[0].loginID,
        keystore: accounts[0].keystore
      });
      assert.deepEqual(out, augur.accounts.account);
    }
  });
  test({
    description: 'Should error if loginAccount is undefined',
    prepareLoginAccount: function(accounts) {
      //  see first test for explaination of this func
      return undefined;
    },
    cb: function(account) {
      assert.deepEqual(account, { error: 'no response or bad input'});
      assert.deepEqual(augur.accounts.account, {});
    },
    assertions: function(out) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
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
      assert.deepEqual(account, { error: 'no response or bad input'});
      assert.deepEqual(augur.accounts.account, {});
    },
    assertions: function(out) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
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
      assert.deepEqual(account, { error: 'no response or bad input'});
      assert.deepEqual(augur.accounts.account, {});
    },
    assertions: function(out) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
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
      assert.deepEqual(account, { error: 'no response or bad input'});
      assert.deepEqual(augur.accounts.account, {});
    },
    assertions: function(out) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
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
      assert.deepEqual(account, { error: 'no response or bad input'});
      assert.deepEqual(augur.accounts.account, {});
    },
    assertions: function(out) {
      // because we pass a cb in this example, out shouldn't be defined
      assert.isUndefined(out);
    }
  });
});
describe("accounts.login", function() {
  // 7 tests total
  var deriveKey = keys.deriveKey;
  var getMAC = keys.getMAC;
  var decrypt = keys.decrypt;
  var finished;
  afterEach(function() {
    augur.accounts.account = {};
    keys.deriveKey = deriveKey;
    keys.getMAC = getMAC;
    keys.decrypt = decrypt;
  });
  var test = function(t) {
    it(t.description, function(done) {
      keys.deriveKey = t.deriveKey || deriveKey;
      keys.getMAC = t.getMAC || getMAC;
      keys.decrypt = t.decrypt || decrypt;
      var loginID = t.prepareLoginID(accounts);
      finished = done;

      var out = augur.accounts.login(loginID, t.password, t.cb);
      t.assertions(out);
    });
  };
  test({
    description: 'Should return an error on blank password',
    prepareLoginID: function(accounts) {
      return accounts[0].loginID;
    },
    password: '',
    cb: function(account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error on undefined password, no callback',
    prepareLoginID: function(accounts) {
      return accounts[0].loginID;
    },
    password: undefined,
    cb: undefined,
    assertions: function(out) {
      assert.deepEqual(out, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    }
  });
  test({
    description: 'Should return an error on undefined loginID',
    prepareLoginID: function(accounts) {
      return undefined;
    },
    password: accounts[0].password,
    cb: function(account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error if keys.deriveKey returns an error object',
    prepareLoginID: function(accounts) {
      return accounts[0].loginID;
    },
    password: accounts[0].password,
    cb: function(account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    deriveKey: function(password, salt, options, cb) {
      cb({ error: 'DeriveKey failed!' });
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error if keys.getMAC does not match the ketstore.crypto.mac value',
    prepareLoginID: function(accounts) {
      return accounts[0].loginID;
    },
    password: accounts[0].password,
    cb: function(account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    getMAC: function(derivedKey, storedKey) {
      return '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error if we fail to generate the privateKey and derivedKey will return a hex string instead of buffer',
    prepareLoginID: function(accounts) {
      return accounts[0].loginID;
    },
    password: accounts[0].password,
    cb: function(account) {
      var expected = augur.errors.BAD_CREDENTIALS;
      expected.bubble = new Error('Uh-Oh!');
      assert.deepEqual(account, expected);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    deriveKey: function(password, salt, options, cb) {
      cb(accounts[0].derivedKey.toString('hex'));
    },
    decrypt: function(ciphertext, key, iv, algo) {
      throw new Error('Uh-Oh!');
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should successfully login if given a valid loginID and password',
    prepareLoginID: function(accounts) {
      return accounts[0].loginID;
    },
    password: accounts[0].password,
    cb: function(account) {
      assert.deepEqual(augur.accounts.account, account);
      assert.deepEqual(account.loginID, accounts[0].loginID);
      assert.deepEqual(account.address, accounts[0].address);
      assert.deepEqual(account.privateKey, accounts[0].privateKey);
      assert.deepEqual(account.derivedKey, accounts[0].derivedKey);
      assert.deepEqual(account.keystore, accounts[0].keystore);
      finished();
    },
    assertions: function(out) {
      assert.isUndefined(out);
    }
  });
});
describe("accounts.loginWithMasterKey", function() {
  // 1 test total
  var privateKey = '';
  afterEach(function() {
    augur.accounts.account = {};
  });
  var test = function(t) {
    it(t.description, function() {
      privateKey = t.preparePrivateKey(accounts);
      augur.accounts.loginWithMasterKey(t.name, privateKey, t.assertions);
    });
  };
  test({
    description: 'Should handle logging into an account using a name and privateKey string',
    name: 'MyAwesomeAccount',
    preparePrivateKey: function(accounts) {
      return accounts[0].privateKey.toString('hex');
    },
    assertions: function(account) {
      assert.deepEqual(account, {
        name: 'MyAwesomeAccount',
        loginID: augur.base58Encode({name: 'MyAwesomeAccount'}),
        address: abi.format_address(keys.privateKeyToAddress(privateKey)),
        privateKey: new Buffer(privateKey, "hex"),
        derivedKey: new Buffer(abi.unfork(utils.sha256(new Buffer(privateKey, "hex"))), "hex")
      });
      assert.deepEqual(account, augur.accounts.account);
    }
  });
});
describe("accounts.logout", function() {
  // 1 test total
  var clear = augur.rpc.clear;
  var clearCC = 0;
  afterEach(function() {
    augur.rpc.clear = clear;
  });
  var test = function(t) {
    it(t.description, function() {
      clearCC = 0;
      augur.rpc.clear = t.clear;
      augur.accounts.account = t.account;
      augur.accounts.logout();
      t.assertions();
    });
  };
  test({
    description: 'Should clear out augur.accounts.account and should call rpc.clear to clear the current account out of rpc.',
    account: { name: 'accountName', address: '0x1' },
    clear: function() {
      clearCC++;
    },
    assertions: function() {
      assert.deepEqual(augur.accounts.account, {});
      assert.deepEqual(clearCC, 1);
    }
  });
});
describe("accounts.submitTx", function() {});
describe("accounts.getTxNonce", function() {
  // 5 tests total
  var pendingTxCount = augur.rpc.pendingTxCount;
  var submitTx = augur.accounts.submitTx;
  var finished;
  afterEach(function() {
    augur.accounts.account = {};
    augur.rpc.pendingTxCount = pendingTxCount;
    augur.accounts.submitTx = submitTx;
  });
  var test = function(t) {
    it(t.description, function(done) {
      augur.rpc.pendingTxCount = t.pendingTxCount || pendingTxCount;
      augur.accounts.submitTx = t.assertions;
      augur.accounts.account = t.account;
      finished = done;
      augur.accounts.getTxNonce(t.packaged, t.cb);
    });
  };
  test({
    description: 'Should call submitTx with packaged and cb if pacakge.nonce is defined.',
    account: {},
    packaged: { nonce: abi.hex('54') },
    cb: utils.noop,
    assertions: function(packaged, cb) {
      assert.deepEqual(packaged, { nonce: '0x36' });
      assert.deepEqual(cb, utils.noop);
      finished();
    }
  });
  test({
    description: 'Should call submitTx if !packaged.nonce and pendingTxCount returns undefined',
    account: { address: '0x1' },
    packaged: {},
    cb: utils.noop,
    pendingTxCount: function(address, cb) {
      cb(undefined);
    },
    assertions: function(packaged, cb) {
      assert.deepEqual(packaged, {});
      assert.deepEqual(cb, utils.noop);
      finished();
    }
  });
  test({
    description: 'Should call submitTx if !packaged.nonce and pendingTxCount returns an object with an error key',
    account: { address: '0x1' },
    packaged: {},
    cb: utils.noop,
    pendingTxCount: function(address, cb) {
      cb({error: 'Uh-Oh!'});
    },
    assertions: function(packaged, cb) {
      assert.deepEqual(packaged, {});
      assert.deepEqual(cb, utils.noop);
      finished();
    }
  });
  test({
    description: 'Should call submitTx if !packaged.nonce and pendingTxCount returns error object',
    account: { address: '0x1' },
    packaged: {},
    cb: utils.noop,
    pendingTxCount: function(address, cb) {
      cb(new Error('Uh-Oh!'));
    },
    assertions: function(packaged, cb) {
      assert.deepEqual(packaged, {});
      assert.deepEqual(cb, utils.noop);
      finished();
    }
  });
  test({
    description: 'Should call submitTx if !packaged.nonce and pendingTxCount returns a txCount',
    account: { address: '0x1' },
    packaged: {},
    cb: utils.noop,
    pendingTxCount: function(address, cb) {
      cb('15');
    },
    assertions: function(packaged, cb) {
      assert.deepEqual(packaged, { nonce: '0xf' });
      assert.deepEqual(cb, utils.noop);
      finished();
    }
  });
});
describe("accounts.invoke", function() {});
