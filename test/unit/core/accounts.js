"use strict";

var assert = require("chai").assert;
var errors = require("ethrpc").errors;
var keys = require("keythereum");
var abi = require("augur-abi");
var augur = new (require("../../../src"))();
var constants = require("../../../src/constants");
var noop = require("../../../src/utils/noop");
var pass = require("../../../src/utils/pass");
var sha256 = require("../../../src/utils/sha256");
var clearCallCounts = require("../../tools").clearCallCounts;
var proxyquire = require("proxyquire").noCallThru().noPreserveCache();

var accounts = [{
  address: undefined,
  password: "helloWorld",
  keystore: undefined,
  privateKey: undefined,
  derivedKey: undefined
}, {
  address: undefined,
  password: "password",
  keystore: undefined,
  privateKey: undefined,
  derivedKey: undefined
}];

describe("accounts.register", function () {
  // 9 tests total
  var create = keys.create;
  var deriveKey = keys.deriveKey;
  var KDF = constants.KDF;
  afterEach(function () {
    augur.accounts.account = {};
    keys.create = create;
    keys.deriveKey = deriveKey;
    constants.KDF = KDF;
  });
  var test = function (t) {
    it(t.description, function (done) {
      keys.create = t.create || create;
      keys.deriveKey = t.deriveKey || deriveKey;
      constants.KDF = t.KDF || KDF;

      augur.accounts.register(t.password, function (result) {
        t.assertions(result);
        done();
      });
    });
  };
  test({
    description: 'should return an error if the password is < 6 characters long',
    password: 'pass',
    assertions: function (result) {
      assert.deepEqual(result, errors.PASSWORD_TOO_SHORT);
    }
  });
  test({
    description: 'should return an error if the password is undefined',
    password: undefined,
    assertions: function (result) {
      assert.deepEqual(result, errors.PASSWORD_TOO_SHORT);
    }
  });
  test({
    description: 'should return an error if there is an issue creating the private key',
    password: 'somevalidpassword',
    create: function (params, cb) {
      cb({error: 999, message: 'Uh-Oh!'});
    },
    assertions: function (result) {
      assert.deepEqual(result, {error: 999, message: 'Uh-Oh!'});
    }
  });
  test({
    description: 'should return an error if there is an issue deriving the secret key',
    password: 'somevalidpassword',
    deriveKey: function (password, salt, options, cb) {
      cb({ error: 999, message: 'Uh-Oh!' });
    },
    assertions: function (result) {
      assert.deepEqual(result, {error: 999, message: 'Uh-Oh!'});
    }
  });
  test({
    description: 'should register an account given a valid password - account 1',
    password: accounts[0].password,
    assertions: function (result) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));

      assert.deepEqual(result, augur.accounts.account);

      accounts[0].address = result.address;
      accounts[0].privateKey = result.privateKey;
      accounts[0].keystore = result.keystore;
      accounts[0].derivedKey = result.derivedKey;
    }
  });
  test({
    description: 'should register an account given a valid password - account 2',
    password: accounts[1].password,
    assertions: function (result) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));

      assert.deepEqual(result, augur.accounts.account);

      accounts[1].address = result.address;
      accounts[1].privateKey = result.privateKey;
      accounts[1].keystore = result.keystore;
      accounts[1].derivedKey = result.derivedKey;
    }
  });
  test({
    description: 'should register an account given a valid password, should handle pbkdf2 KDF',
    password: 'thisisavalidpassword',
    KDF: 'pbkdf2',
    assertions: function (result) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, augur.accounts.account);
    }
  });
  test({
    description: 'should register an account given a valid password, should handle scrypt KDF',
    password: 'thisisavalidpassword',
    KDF: 'scrypt',
    assertions: function (result) {
      assert.isString(result.address);
      assert.isObject(result.keystore);
      assert(Buffer.isBuffer(result.privateKey));
      assert(Buffer.isBuffer(result.derivedKey));
      assert.deepEqual(result, augur.accounts.account);
    }
  });
});
describe("accounts.fundNewAccountFromFaucet", function () {
  // 7 tests total
  var balance = augur.rpc.balance;
  var fundNewAccount = augur.fundNewAccount;
  var fastforward = augur.rpc.fastforward;
  var finished;
  var callCounts = {
    balance: 0,
    fastforward: 0
  };
  afterEach(function () {
    clearCallCounts(callCounts);
    augur.rpc.balance = balance;
    augur.fundNewAccount = fundNewAccount;
    augur.rpc.fastforward = fastforward;
  });
  var test = function (t) {
    it(t.description, function (done) {
      augur.rpc.balance = t.balance || balance;
      augur.fundNewAccount = t.fundNewAccount || fundNewAccount;
      augur.rpc.fastforward = t.fastforward || fastforward;

      finished = done;
      // before each test, call accounts module but replace request with our mock, then run the function exported from accounts with augur set as our this. finally call fundNewAccountFromFaucet to test.
      proxyquire('../../../src/fund-new-account', {
        'request': t.mockRequest
      }).call(augur).fundNewAccountFromFaucet(t.registeredAddress, t.branch, t.onSent, t.onSuccess, t.onFailed);
      // augur.accounts.fundNewAccountFromFaucet(t.registeredAddress, t.branch, t.onSent, t.onSuccess, t.onFailed);
    });
  };
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is null',
    registeredAddress: null,
    branch: '101010',
    onFailed: function (err) {
      assert.isNull(err);
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(new Error('this should never be hit in this example!'), null, null);
    		};
    	}
    }
  });
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is undefined',
    registeredAddress: undefined,
    branch: '101010',
    onFailed: function (err) {
      assert.isUndefined(err);
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(new Error('this should never be hit in this example!'), null, null);
    		};
    	}
    }
  });
  test({
    description: 'Should return the registeredAddress to onFailed if registeredAddress is not a string',
    registeredAddress: {},
    branch: '101010',
    onFailed: function (err) {
      assert.deepEqual(err, {});
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(new Error('this should never be hit in this example!'), null, null);
    		};
    	}
    }
  });
  test({
    description: 'If the request to the URL returns an error, pass the error to onFailed',
    registeredAddress: '0x1',
    branch: '101010',
    onFailed: function (err) {
      assert.deepEqual(err, new Error('Invalid URI "' + constants.FAUCET + '0x0000000000000000000000000000000000000001'));
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(new Error('Invalid URI "' + constants.FAUCET + '0x0000000000000000000000000000000000000001'), null, 'some responseBody, this doesnt matter for our test.');
    		};
    	}
    }
  });
  test({
    description: 'If the request to the URL returns a status not equal to 200',
    registeredAddress: '0x1',
    branch: '101010',
    onFailed: function (err) {
      assert.deepEqual(err, 404);
      assert.deepEqual(callCounts, {
        balance: 0,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(null, { statusCode: 404 }, 'some responseBody, this doesnt matter for our test.');
    		};
    	}
    }
  });
  test({
    description: 'If the request to the URL returns a status of 200, and augur.rpc.balance returns a number greater than 0 we call fundNewAccount',
    registeredAddress: '0x1',
    balance: function (address, cb) {
      callCounts.balance++;
      assert.deepEqual(address, '0x1');
      cb('1000');
    },
    fundNewAccount: function (arg) {
      assert.deepEqual(arg, {
        branch: constants.DEFAULT_BRANCH_ID,
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      });
      assert.deepEqual(callCounts, {
        balance: 1,
        fastforward: 0
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(null, { statusCode: 200 }, 'some responseBody, this doesnt matter for our test.');
    		};
    	}
    }
  });
  test({
    description: 'Should retry to fund account by fastforwarding through the blocks until we hit the most recent block and balance returns a value greater than 0',
    registeredAddress: '0x1',
    branch: '101010',
    onSent: pass,
    onSuccess: pass,
    onFailed: pass,
    balance: function (address, cb) {
      callCounts.balance++;
      assert.deepEqual(address, '0x1');
      switch(callCounts.balance) {
      case 5:
        cb('1000');
        break;
      default:
        cb('0');
        break;
      }
    },
    fastforward: function (blocks, cb) {
      callCounts.fastforward++;
      switch(callCounts.fastforward) {
      case 4:
        cb('101010');
        break;
      default:
        cb('101009');
        break;
      }
    },
    fundNewAccount: function (arg) {
      assert.deepEqual(arg, {
        branch: '101010',
        onSent: pass,
        onSuccess: pass,
        onFailed: pass
      });
      assert.deepEqual(callCounts, {
        balance: 5,
        fastforward: 4
      });
      finished();
    },
    mockRequest: {
    	defaults: function () {
    		// defaults is called when accounts is called. it prepares and returns the http request function, so mock this behavior.
    		return function (url, cb) {
    			// acts as our request() call in accounts
          // cb(err, response, body);
    			cb(null, { statusCode: 200 }, 'some responseBody, this doesnt matter for our test.');
    		};
    	}
    }
  });
});
describe("accounts.fundNewAccountFromAddress", function () {
  // 3 tests total
  var sendEther = augur.rpc.sendEther;
  var fundNewAccount = augur.fundNewAccount;
  afterEach(function () {
    augur.rpc.sendEther = sendEther;
    augur.fundNewAccount = fundNewAccount;
  });
  var test = function (t) {
    it(t.description, function () {
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
    onSent: function () {},
    onSuccess: function () {},
    onFailed: function (err) {
      assert.deepEqual(err, { error: 999, message: 'Uh-Oh!' });
    },
    sendEther: function (tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onFailed({ error: 999, message: 'Uh-Oh!' });
    },
    fundNewAccount: function (tx) {
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
    sendEther: function (tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onSuccess({ callReturn: '1', txHash: '0x3'});
    },
    fundNewAccount: function (tx) {
      assert.deepEqual(tx, {
        branch: '101010',
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
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
    sendEther: function (tx) {
      assert.equal(tx.to, '0x2');
      assert.equal(tx.value, '10');
      assert.equal(tx.from, '0x1');
      assert.deepEqual(tx.onSent, noop);
      assert.isFunction(tx.onSuccess);
      assert.isFunction(tx.onFailed);
      tx.onSuccess({ callReturn: '1', txHash: '0x3'});
    },
    fundNewAccount: function (tx) {
      assert.deepEqual(tx, {
        branch: constants.DEFAULT_BRANCH_ID,
        onSent: noop,
        onSuccess: noop,
        onFailed: noop
      });
    }
  });
});
describe("accounts.setAccountObject", function () {
  // 2 tests total
  augur.accounts.account = {};
  afterEach(function () {
    augur.accounts.account = {};
  });
  var test = function (t) {
    it(t.description, function () {
      var account = t.prepareAccount(accounts);
      augur.accounts.setAccountObject(account);
      t.assertions();
    });
  };
  test({
    description: 'Should set the account object to the passed in account',
    prepareAccount: function (accounts) {
      return accounts[0];
    },
    assertions: function (out) {
      assert.deepEqual(augur.accounts.account, {
        address: accounts[0].address,
        keystore: accounts[0].keystore,
        privateKey: accounts[0].privateKey,
        derivedKey: accounts[0].derivedKey
      });
    }
  });
  test({
    description: 'Should set the account object to the passed in account and handle a privateKey and derivedKey passed as hex strings',
    prepareAccount: function (accounts) {
      return {
        address: accounts[1].address,
        keystore: accounts[1].keystore,
        privateKey: accounts[1].privateKey.toString('hex'),
        derivedKey: accounts[1].derivedKey.toString('hex')
      };
    },
    assertions: function (out) {
      assert.deepEqual(augur.accounts.account, {
        address: accounts[1].address,
        keystore: accounts[1].keystore,
        privateKey: accounts[1].privateKey,
        derivedKey: accounts[1].derivedKey
      });
    }
  });
});
describe("accounts.importAccount", function () {
  // 4 tests total
  var recover = keys.recover;
  var deriveKey = keys.deriveKey;
  var keystore = {};
  var finished;
  afterEach(function () {
    augur.accounts.account = {};
    keys.recover = recover;
    keys.deriveKey = deriveKey;
  });
  var test = function (t) {
    it(t.description, function (done) {
      keys.recover = t.recover || recover;
      keys.deriveKey = t.deriveKey || deriveKey;
      keystore = t.prepareKeystore(accounts);
      finished = done;
      var out = augur.accounts.importAccount(t.password, keystore, t.cb);

      t.assertions(out);
    });
  };
  test({
    description: 'Should handle importing an account',
    password: accounts[0].password,
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    cb: function (account) {
      assert.deepEqual(account, {
        privateKey: accounts[0].privateKey,
        address: abi.format_address(accounts[0].address),
        keystore: accounts[0].keystore,
        derivedKey: accounts[0].derivedKey
      });
      assert.deepEqual(augur.accounts.account, account);
      finished();
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should handle no cb and blank password by returning an error',
    password: '',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    cb: undefined,
    assertions: function (out) {
      assert.deepEqual(out, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    }
  });
  test({
    description: 'Should handle an issue recovering the privateKey by returning an error',
    password: accounts[0].password,
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    recover: function (password, keystore, cb) {
      cb({ error: 'Uh-Oh!' });
    },
    cb: function (account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  // this test doesn't apply anymore, but we should consider adding an error check on deriveKey just incase...
  // test({
  //   description: 'Should handle an issue deriving the derivedKey by returning an error',
  //   password: accounts[0].password,
  //   prepareKeystore: function (accounts) {
  //     return accounts[0].keystore;
  //   },
  //   recover: function (password, keystore, cb) {
  //     // because recover calls deriveKey we need to mock it for this test as well and just return the privateKey it would return anyway...
  //     cb(accounts[0].privateKey);
  //   },
  //   deriveKey: function (password, salt, iv, cb) {
  //     cb({ error: 'Uh-Oh!' });
  //   },
  //   cb: function (account) {
  //     assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
  //     assert.deepEqual(augur.accounts.account, {});
  //     finished();
  //   },
  //   assertions: function (out) {
  //     assert.isUndefined(out);
  //   }
  // });
});
describe("accounts.login", function () {
  // 7 tests total
  var deriveKey = keys.deriveKey;
  var getMAC = keys.getMAC;
  var decrypt = keys.decrypt;
  var finished;
  afterEach(function () {
    augur.accounts.account = {};
    keys.deriveKey = deriveKey;
    keys.getMAC = getMAC;
    keys.decrypt = decrypt;
  });
  var test = function (t) {
    it(t.description, function (done) {
      keys.deriveKey = t.deriveKey || deriveKey;
      keys.getMAC = t.getMAC || getMAC;
      keys.decrypt = t.decrypt || decrypt;
      var keystore = t.prepareKeystore(accounts);
      finished = done;

      var out = augur.accounts.login(keystore, t.password, t.cb);
      t.assertions(out);
    });
  };
  test({
    description: 'Should return an error on blank password',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    password: '',
    cb: function (account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error on undefined password, no callback',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    password: undefined,
    cb: undefined,
    assertions: function (out) {
      assert.deepEqual(out, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    }
  });
  test({
    description: 'Should return an error on undefined loginID',
    prepareKeystore: function (accounts) {
      return undefined;
    },
    password: accounts[0].password,
    cb: function (account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error if keys.deriveKey returns an error object',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    password: accounts[0].password,
    cb: function (account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    deriveKey: function (password, salt, options, cb) {
      cb({ error: 'DeriveKey failed!' });
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error if keys.getMAC does not match the ketstore.crypto.mac value',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    password: accounts[0].password,
    cb: function (account) {
      assert.deepEqual(account, augur.errors.BAD_CREDENTIALS);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    getMAC: function (derivedKey, storedKey) {
      return '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should return an error if we fail to generate the privateKey and derivedKey will return a hex string instead of buffer',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    password: accounts[0].password,
    cb: function (account) {
      var expected = augur.errors.BAD_CREDENTIALS;
      expected.bubble = new Error('Uh-Oh!');
      assert.deepEqual(account, expected);
      assert.deepEqual(augur.accounts.account, {});
      finished();
    },
    deriveKey: function (password, salt, options, cb) {
      cb(accounts[0].derivedKey.toString('hex'));
    },
    decrypt: function (ciphertext, key, iv, algo) {
      throw new Error('Uh-Oh!');
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
  test({
    description: 'Should successfully login if given a valid loginID and password',
    prepareKeystore: function (accounts) {
      return accounts[0].keystore;
    },
    password: accounts[0].password,
    cb: function (account) {
      assert.deepEqual(augur.accounts.account, account);
      assert.deepEqual(account.loginID, accounts[0].loginID);
      assert.deepEqual(account.address, accounts[0].address);
      assert.deepEqual(account.privateKey, accounts[0].privateKey);
      assert.deepEqual(account.derivedKey, accounts[0].derivedKey);
      assert.deepEqual(account.keystore, accounts[0].keystore);
      finished();
    },
    assertions: function (out) {
      assert.isUndefined(out);
    }
  });
});
describe("accounts.loginWithMasterKey", function () {
  // 1 test total
  var privateKey = '';
  afterEach(function () {
    augur.accounts.account = {};
  });
  var test = function (t) {
    it(t.description, function () {
      privateKey = t.preparePrivateKey(accounts);
      augur.accounts.loginWithMasterKey(privateKey, t.assertions);
    });
  };
  test({
    description: 'Should handle logging into an account using a privateKey hex string',
    preparePrivateKey: function (accounts) {
      return accounts[0].privateKey.toString('hex');
    },
    assertions: function (account) {
      assert.deepEqual(account, {
        address: abi.format_address(keys.privateKeyToAddress(privateKey)),
        privateKey: Buffer.from(privateKey, "hex"),
        derivedKey: Buffer.from(abi.unfork(sha256(Buffer.from(privateKey, "hex"))), "hex")
      });
      assert.deepEqual(account, augur.accounts.account);
    }
  });
});
describe("accounts.logout", function () {
  // 1 test total
  var clear = augur.rpc.clear;
  var clearCC = 0;
  afterEach(function () {
    augur.rpc.clear = clear;
  });
  var test = function (t) {
    it(t.description, function () {
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
    clear: function () {
      clearCC++;
    },
    assertions: function () {
      assert.deepEqual(augur.accounts.account, {});
      assert.deepEqual(clearCC, 1);
    }
  });
});
