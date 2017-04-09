"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var chalk = require("chalk");
var clone = require("clone");
var keys = require("keythereum");
var abi = require("augur-abi");
var sha256 = require("../../../src/utils/sha256");
var constants = require("../../../src/constants");
var tools = require("../../tools");
var random = require("../../random");
var augur = new (require("../../../src"))();

// generate random private key
var privateKey = crypto.randomBytes(32);
var address = keys.privateKeyToAddress(privateKey);

// generate random names and passwords
var password = sha256(Math.random().toString(36).substring(4));
var password2 = sha256(Math.random().toString(36).substring(4)).slice(10);

var keystore, keystore2;

function checkAccount(augur, account, noWebAccountCheck) {
  assert.notProperty(account, "error");
  assert.isString(account.address);
  assert.isObject(account.keystore);
  assert.strictEqual(account.address.length, 42);
  if (!noWebAccountCheck) {
    assert.isTrue(Buffer.isBuffer(augur.accounts.account.privateKey));
    assert.isString(augur.accounts.account.address);
    assert.isObject(augur.accounts.account.keystore);
    assert.strictEqual(
      augur.accounts.account.privateKey.toString("hex").length,
      constants.KEYSIZE*2
    );
    assert.strictEqual(augur.accounts.account.address.length, 42);
    assert.strictEqual(account.address, augur.accounts.account.address);
    assert.strictEqual(
      JSON.stringify(account.keystore),
      JSON.stringify(augur.accounts.account.keystore)
    );
  }
  assert.strictEqual(account.address.length, 42);
}

describe("Register", function () {
  afterEach(function () { augur.accounts.logout(); });
  it("register account 1: " + password, function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.register(password, function (result) {
      checkAccount(augur, result, true);
      keystore = result.keystore;
      assert.notProperty(keystore, "error");
      assert(keystore.crypto.ciphertext);
      assert(keystore.crypto.cipherparams.iv);
      assert(keystore.crypto.kdfparams.salt);
      assert.strictEqual(
        keystore.crypto.cipherparams.iv.length,
        constants.IVSIZE*2
      );
      assert.strictEqual(
        keystore.crypto.kdfparams.salt.length,
        constants.KEYSIZE*2
      );
      assert.strictEqual(
        keystore.crypto.ciphertext.length,
        constants.KEYSIZE*2
      );
      done();
    });
  });
  it("register account 2: " + password2, function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.register(password2, function (result) {
      checkAccount(augur, result, true);
      keystore2 = result.keystore;
      assert(keystore2.crypto.ciphertext);
      assert(keystore2.crypto.cipherparams.iv);
      assert(keystore2.crypto.kdfparams.salt);
      assert.strictEqual(
        keystore2.crypto.cipherparams.iv.length,
        constants.IVSIZE*2
      );
      assert.strictEqual(
        keystore2.crypto.kdfparams.salt.length,
        constants.KEYSIZE*2
      );
      assert.strictEqual(
        keystore2.crypto.ciphertext.length,
        constants.KEYSIZE*2
      );
      done();
    });
  });
});

describe("Import Account", function () {
  afterEach(function () { augur.accounts.logout(); });
  it("Import Account should login the account given password and keystore", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.importAccount(password, keystore, function (user) {
      assert.notProperty(user, "error");
      assert.isTrue(Buffer.isBuffer(augur.accounts.account.privateKey));
      assert.isString(user.address);
      assert.isObject(user.keystore);
      assert.strictEqual(augur.accounts.account.privateKey.toString("hex").length, constants.KEYSIZE*2);
      assert.strictEqual(user.address.length, 42);
      done();
    });
  });
});

describe("Login", function () {
  afterEach(function () { augur.accounts.logout(); });
  it("login and decrypt the stored private key", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.login(keystore, password, function (user) {
      assert.notProperty(user, "error");
      assert.isTrue(Buffer.isBuffer(augur.accounts.account.privateKey));
      assert.isString(user.address);
      assert.isObject(user.keystore);
      assert.strictEqual(augur.accounts.account.privateKey.toString("hex").length, constants.KEYSIZE*2);
      assert.strictEqual(user.address.length, 42);
      done();
    });
  });
  it("login twice as the same user", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.login(keystore, password, function (user) {
      assert.notProperty(user, "error");
      assert.isTrue(Buffer.isBuffer(augur.accounts.account.privateKey));
      assert.isString(user.address);
      assert.isObject(user.keystore);
      assert.strictEqual(augur.accounts.account.privateKey.toString("hex").length, constants.KEYSIZE*2);
      assert.strictEqual(user.address.length, 42);
      augur.accounts.login(keystore, password, function (same_user) {
        assert(!same_user.error);
        assert.strictEqual(user.address, same_user.address);
        done();
      });
    });
  });
  it("login with a private key", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.loginWithMasterKey("5169fdd07cb61657ad0d1c60f1132eed52c91949d6d85654110b11ede80a6d2e", function (user) {
      assert.notProperty(user, "error");
      assert.isTrue(Buffer.isBuffer(augur.accounts.account.privateKey));
      assert.isTrue(Buffer.isBuffer(augur.accounts.account.derivedKey));
      assert.isString(user.address);
      assert.isUndefined(user.keystore);
      assert.strictEqual(augur.accounts.account.privateKey.toString("hex").length, constants.KEYSIZE*2);
      assert.strictEqual(augur.accounts.account.privateKey.toString("hex"), "5169fdd07cb61657ad0d1c60f1132eed52c91949d6d85654110b11ede80a6d2e");
      assert.strictEqual(augur.accounts.account.derivedKey.toString("hex"), abi.unfork(sha256(Buffer.from("5169fdd07cb61657ad0d1c60f1132eed52c91949d6d85654110b11ede80a6d2e", "hex"))));
      assert.strictEqual(user.address.length, 42);
      assert.strictEqual(user.address, abi.format_address(user.address));
      assert.strictEqual(user.address, abi.format_address(keys.privateKeyToAddress("5169fdd07cb61657ad0d1c60f1132eed52c91949d6d85654110b11ede80a6d2e", "hex")));
      done();
    });
  });
  it("fail with error 403 when given a blank keystore", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.login("", password, function (user) {
      assert.strictEqual(user.error, 403);
      done();
    });
  });
  it("fail with error 403 when given a blank password", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.login(keystore, "", function (user) {
      assert.strictEqual(user.error, 403);
      done();
    });
  });
  it("fail with error 403 when given a blank keystore and a blank password", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.login("", "", function (user) {
      assert.strictEqual(user.error, 403);
      done();
    });
  });
  it("fail with error 403 when given an incorrect password", function (done) {
    this.timeout(tools.TIMEOUT);
    var badPassword = sha256(Math.random().toString(36).substring(4));
    augur.accounts.login(keystore, badPassword, function (user) {
      assert.strictEqual(user.error, 403);
      done();
    });
  });
});

describe("Logout", function () {
  afterEach(function () { augur.accounts.logout(); });
  it("logout and unset the account object", function (done) {
    this.timeout(tools.TIMEOUT);
    augur.accounts.login(keystore, password, function (user) {
      assert.notProperty(user, "error");
      for (var i = 0; i < 2; ++i) {
        augur.accounts.logout();
        assert.notProperty(augur.accounts.account, "address");
        assert.notProperty(augur.accounts.account, "privateKey");
      }
      done();
    });
  });
});
