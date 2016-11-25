/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var chalk = require("chalk");
var clone = require("clone");
var keys = require("keythereum");
var EthTx = require("ethereumjs-tx");
var EthUtil = require("ethereumjs-util");
var abi = require("augur-abi");
var utils = require("../../../src/utilities");
var constants = require("../../../src/constants");
var tools = require("../../tools");
var random = require("../../random");
var augur = require("../../../src");

// generate random private key
var privateKey = crypto.randomBytes(32);
var address = keys.privateKeyToAddress(privateKey);

// generate random names and passwords
var name = utils.sha256(new Date().toString());
var password = utils.sha256(Math.random().toString(36).substring(4));

var loginID;
var generatedKeystore;

var name2 = utils.sha256(new Date().toString()).slice(10) + "@" +
    utils.sha256(new Date().toString()).slice(10) + ".com";
var password2 = utils.sha256(Math.random().toString(36).substring(4)).slice(10);
var loginID2;

function checkAccount(augur, account, noWebAccountCheck) {
    assert.notProperty(account, "error");
    assert.isString(account.address);
    assert.isObject(account.keystore);
    assert.strictEqual(account.address.length, 42);
        if (!noWebAccountCheck) {
            assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
            assert.isString(augur.web.account.address);
            assert.isObject(augur.web.account.keystore);
            assert.strictEqual(
                augur.web.account.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(augur.web.account.address.length, 42);
            assert.strictEqual(account.address, augur.web.account.address);
            assert.strictEqual(
                JSON.stringify(account.keystore),
                JSON.stringify(augur.web.account.keystore)
            );
        }
    assert.strictEqual(account.address.length, 42);
}

afterEach(function () { augur.web.logout(); });

describe("Register", function () {
    it("register account 1: " + name + " / " + password, function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.register(name, password, function (result) {
            checkAccount(augur, result, true);
            loginID = result.loginID;
            var rec = result.keystore;
                        generatedKeystore = result.keystore;
            assert.notProperty(rec, "error");
            assert(rec.crypto.ciphertext);
            assert(rec.crypto.cipherparams.iv);
            assert(rec.crypto.kdfparams.salt);
            assert.strictEqual(
                rec.crypto.cipherparams.iv.length,
                constants.IVSIZE*2
            );
            assert.strictEqual(
                rec.crypto.kdfparams.salt.length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(
                rec.crypto.ciphertext.length,
                constants.KEYSIZE*2
            );
            done();
        });
    });
    it("register account 2: " + name2 + " / " + password2, function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.register(name2, password2, function (result) {
            checkAccount(augur, result, true);
            loginID2 = result.loginID;
            var rec = result.keystore;
            assert(rec.crypto.ciphertext);
            assert(rec.crypto.cipherparams.iv);
            assert(rec.crypto.kdfparams.salt);
            assert.strictEqual(
                rec.crypto.cipherparams.iv.length,
                constants.IVSIZE*2
            );
            assert.strictEqual(
                rec.crypto.kdfparams.salt.length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(
                rec.crypto.ciphertext.length,
                constants.KEYSIZE*2
            );
            done();
        });
    });
});

describe("Import Account", function () {
    it("Import Account should login the account given name, password, and keystore", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.importAccount(name, password, generatedKeystore, function (user) {
                assert.notProperty(user, "error");
                assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
                assert.isString(user.address);
                assert.isString(user.loginID);
                assert.isString(user.name);
                assert.isObject(user.keystore);
                assert.strictEqual(
                        augur.web.account.privateKey.toString("hex").length,
                        constants.KEYSIZE*2
                );
                assert.strictEqual(user.address.length, 42);
                done();
        });
    });
});

describe("Login", function () {
    it("login and decrypt the stored private key", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login(loginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
            assert.isString(user.address);
            assert.isObject(user.keystore);
            assert.strictEqual(
                augur.web.account.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(user.address.length, 42);
            done();
        });
    });
    it("login twice as the same user", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login(loginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
            assert.isString(user.address);
            assert.isObject(user.keystore);
            assert.strictEqual(
                augur.web.account.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(user.address.length, 42);
            augur.web.login(loginID, password, function (same_user) {
                assert(!same_user.error);
                assert.strictEqual(user.address, same_user.address);
                done();
            });
        });
    });
    it("fail with error 403 when given an incorrect loginID", function (done) {
        this.timeout(tools.TIMEOUT);
        var badLoginID = utils.sha256(new Date().toString());
        augur.web.login(badLoginID, password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });
    it("fail with error 403 when given a blank loginID", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login("", password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });
    it("fail with error 403 when given a blank password", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login(loginID, "", function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });
    it("fail with error 403 when given a blank loginID and a blank password", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login("", "", function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });
    it("fail with error 403 when given an incorrect password", function (done) {
        this.timeout(tools.TIMEOUT);
        var bad_password = utils.sha256(Math.random().toString(36).substring(4));
        augur.web.login(loginID, bad_password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });
    it("fail with error 403 when given an incorrect loginID and an incorrect password", function (done) {
        this.timeout(tools.TIMEOUT);
        var bad_loginID = utils.sha256(new Date().toString());
        var bad_password = utils.sha256(Math.random().toString(36).substring(4));
        augur.web.login(bad_loginID, bad_password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });
});

describe("Logout", function () {
    it("logout and unset the account object", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login(loginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.strictEqual(user.loginID, loginID);
            for (var i = 0; i < 2; ++i) {
                augur.web.logout();
                assert.notProperty(augur.web.account, "loginID");
                assert.notProperty(augur.web.account, "address");
                assert.notProperty(augur.web.account, "privateKey");
            }
            done();
        });
    });
});

describe("Change Account Name", function () {
    it("Should be able to update the account object", function (done) {
        this.timeout(tools.TIMEOUT);
        augur.web.login(loginID, password, function (user) {
            var privateKey = augur.web.account.privateKey;
            augur.web.changeAccountName("testingName", function (updatedUser) {
                assert.deepEqual(user.keystore, updatedUser.keystore);
                assert.strictEqual(updatedUser.name, "testingName");
                assert.strictEqual(user.address, updatedUser.address);
                assert.strictEqual(privateKey.toString("hex"), augur.web.account.privateKey.toString("hex"));
                done();
            });
        });
    });
});

describe("Transaction signing", function () {

    // sign tx with private key
    it("sign raw transaction using private key", function () {
        var tx = new EthTx({
            nonce: "00",
            gasPrice: "09184e72a000",
            gasLimit: "2710",
            to: abi.format_address("0000000000000000000000000000000000000001"),
            value: "00",
            data: "7f7465737432000000000000000000000000000000000000000000000000000000600057"
        });
        tx.sign(privateKey);
        var signed = "f8ba8230308c3039313834653732613030308432373130940000000000000000"+
                     "000000000000000000000001823030b848376637343635373337343332303030"+
                     "3030303030303030";

        // RLP serialization
        var serializedTx = tx.serialize().toString("hex");
        assert.strictEqual(serializedTx.slice(0, 144), signed);
        assert.strictEqual(serializedTx.length, 376);
    });

    // create a new contract
    it("transaction to create a new contract", function () {
        var tx = new EthTx();
        tx.nonce = 0;
        tx.gasPrice = 100;
        tx.gasLimit = 1000;
        tx.value = 0;
        tx.data = "7f4e616d65526567000000000000000000000000000000000000000000000000"+
                  "003057307f4e616d655265670000000000000000000000000000000000000000"+
                  "0000000000573360455760415160566000396000f20036602259604556330e0f"+
                  "600f5933ff33560f601e5960003356576000335700604158600035560f602b59"+
                  "0033560f60365960003356573360003557600035335700";
        tx.sign(privateKey);
        var signed = "80648203e88080b9012e37663465363136643635353236353637303030303030"+
                     "3030303030303030303030303030303030303030303030303030303030303030"+
                     "3030303030303030303030303330353733303766346536313664363535323635"+
                     "3637303030303030303030303030303030303030303030303030303030303030"+
                     "30303030303030303030303030303030303030303537333336303435353736";
        var serializedTx = tx.serialize().toString("hex");
        assert.strictEqual(serializedTx.slice(6, 324), signed);
        assert(serializedTx.length === 764 || serializedTx.length === 762);
    });

    // up-front cost calculation:
    // fee = data length in bytes * 5
    //     + 500 Default transaction fee
    //     + gasAmount * gasPrice
    it("calculate up-front transaction cost", function () {
        var tx = new EthTx();
        tx.nonce = 0;
        tx.gasPrice = 100;
        tx.gasLimit = 1000;
        tx.value = 0;
        tx.data = "7f4e616d65526567000000000000000000000000000000000000000000000000"+
                  "003057307f4e616d655265670000000000000000000000000000000000000000"+
                  "0000000000573360455760415160566000396000f20036602259604556330e0f"+
                  "600f5933ff33560f601e5960003356576000335700604158600035560f602b59"+
                  "0033560f60365960003356573360003557600035335700";
        tx.sign(privateKey);
        assert.strictEqual(tx.getUpfrontCost().toString(), "100000");
    });

    // decode incoming tx using rlp: rlp.decode(itx)
    // (also need to check sender's account to see if they have at least amount of the fee)
    it("should verify sender's signature", function () {
        var rawTx = {
            nonce: "0x00",
            gasPrice: "0x09184e72a000",
            gasLimit: "0x2710",
            to: "0x0000000000000000000000000000000000000000",
            value: "0x00",
            data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057"
        };
        var tx2 = new EthTx(rawTx);
        tx2.sign(privateKey);
        assert.strictEqual(abi.hex(tx2.getSenderAddress()), address);
        assert.isTrue(tx2.verifySignature());
    });
});
