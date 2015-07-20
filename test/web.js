/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var chalk = require("chalk");
var EthTx = require("ethereumjs-tx");
var EthUtil = require("ethereumjs-util");
var eccrypto = require("eccrypto");
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

// create private key, get public key and address
var privateKey = crypto.randomBytes(32);

describe("Accounts", function () {
    var publicKey = eccrypto.getPublic(privateKey);
    var address = EthUtil.pubToAddress(publicKey).toString("hex");

    // user specified handle and password
    var handle = "tinybike";
    var password = "wheethereum";

    // password used as secret key for aes-256 cipher
    var secret = crypto.createHash("sha256").update(password).digest("hex");
    var cipher = crypto.createCipher("aes-256-cbc", secret);
    var encryptedPrivateKey = cipher.update(privateKey, "hex", "base64");
    encryptedPrivateKey += cipher.final("base64");

    // verify private key is recovered by decryption
    it("private key should be recovered using the password to decrypt", function () {
        var decipher = crypto.createDecipher("aes-256-cbc", secret);
        var decryptedPrivateKey = decipher.update(encryptedPrivateKey, "base64", "hex");
        decryptedPrivateKey += decipher.final("hex");
        assert.equal(decryptedPrivateKey, privateKey.toString("hex"));
    });    
});

describe("Transactions", function () {

    // sign tx with private key
    it("sign raw transaction using private key", function () {
        var tx = new EthTx({
            nonce: "00",
            gasPrice: "09184e72a000", 
            gasLimit: "2710",
            to: "0000000000000000000000000000000000000000", 
            value: "00", 
            data: "7f7465737432000000000000000000000000000000000000000000000000000000600057"
        });
        tx.sign(privateKey);
        var signed = "f889808609184e72a00082271094000000000000000000000000000000000000"+
                     "000080a47f746573743200000000000000000000000000000000000000000000"+
                     "0000000000600057";
        var serializedTx = tx.serialize().toString("hex");
        assert.equal(serializedTx.slice(0, 144), signed);
        assert.equal(serializedTx.length, 278);

        // RLP serialization
        // log("Serialized tx:", chalk.green(tx.serialize().toString("hex")));
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
        var signed = "f8e380648203e88080b8977f4e616d6552656700000000000000000000000000"+
                     "0000000000000000000000003057307f4e616d65526567000000000000000000"+
                     "00000000000000000000000000000000573360455760415160566000396000f2"+
                     "0036602259604556330e0f600f5933ff33560f601e5960003356576000335700"+
                     "604158600035560f602b590033560f6036596000335657336000355760003533"+
                     "5700";
        var serializedTx = tx.serialize().toString("hex");
        assert.equal(serializedTx.slice(0, 324), signed);
        assert.equal(serializedTx.length, 458)

        // fee = data length in bytes * 5
        //     + 500 Default transaction fee
        //     + gasAmount * gasPrice
        assert.equal(tx.getUpfrontCost().toString(), "100000");
    });

    // decode incoming tx using rlp: rlp.decode(itx)
    // (also need to check sender's account to see if they have at least amount of the fee)
    it("should verify sender's signature", function () {
        var rawTx = [
            "00",
            "09184e72a000",
            "2710",
            "0000000000000000000000000000000000000000",
            "00",
            "7f7465737432000000000000000000000000000000000000000000000000000000600057",
            "1c",
            "5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab",
            "5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13"
        ];
        var tx2 = new EthTx(rawTx);
        var sender = "1f36f546477cda21bf2296c50976f2740247906f";
        assert.equal(tx2.getSenderAddress().toString("hex"), sender);
        assert(tx2.verifySignature());        
    });

});

describe("Web client", function () {

    // generate random handle and password
    var handle = utilities.sha256(new Date().toString());
    var password = utilities.sha256(Math.random().toString(36).substring(4));

    var handle2 = utilities.sha256(new Date().toString()).slice(10);
    var password2 = utilities.sha256(Math.random().toString(36).substring(4)).slice(10);

    it("should register first account successfully: " + handle + " / " + password, function () {
        this.timeout(constants.timeout);
        assert(Augur.web.db.get(handle).error);
        var result = Augur.web.register(handle, password);
        assert(result.privateKey);
        assert(result.address);
        assert(!result.error);
        assert(!Augur.web.db.get(handle).error);
    });

    it("should register second account successfully: " + handle2 + " / " + password2, function () {
        this.timeout(constants.timeout);
        assert(Augur.web.db.get(handle2).error);
        var result = Augur.web.register(handle2, password2);
        assert(result.privateKey);
        assert(result.address);
        assert(!result.error);
        assert(!Augur.web.db.get(handle2).error);
    });

    it("should fail to register the first handle again", function () {
        this.timeout(constants.timeout);
        var result = Augur.web.register(handle, password);
        assert(!result.privateKey);
        assert(!result.address);
        assert(result.error);
        assert(!Augur.web.db.get(handle).error);
    });

    it("should login successfully and decrypt the stored private key", function () {
        this.timeout(constants.timeout);
        var user = Augur.web.login(handle, password);
        assert(user.privateKey);
        assert(user.address);
        assert.equal(user.privateKey.toString("hex").length, 64);
        assert.equal(user.address.length, 42);
        var same_user = Augur.web.login(handle, password);
        assert.equal(user.privateKey.toString("hex"), same_user.privateKey.toString("hex"));
        assert.equal(user.address, same_user.address);
    });

    it("should fail with error 403 when given an incorrect handle", function () {
        this.timeout(constants.timeout);
        var bad_handle = utilities.sha256(new Date().toString());
        assert.equal(Augur.web.login(bad_handle, password).error, 403);
    });

    it("should fail with error 403 when given an incorrect password", function () {
        this.timeout(constants.timeout);
        var bad_password = utilities.sha256(Math.random().toString(36).substring(4));
        assert.equal(Augur.web.login(handle, bad_password).error, 403);
    });

    it("should fail with error 403 when given an incorrect handle and an incorrect password", function () {
        this.timeout(constants.timeout);
        var bad_handle = utilities.sha256(new Date().toString());
        var bad_password = utilities.sha256(Math.random().toString(36).substring(4));
        assert.equal(Augur.web.login(handle, bad_password).error, 403);
    });

    it("should successfully call the getBranches method using web.invoke", function () {
        this.timeout(constants.timeout);
        var user = Augur.web.login(handle, password);
        var branches = Augur.web.invoke(Augur.tx.getBranches);
        assert(branches.length);
        assert.equal(branches.constructor, Array);
        assert.equal(
            Augur.encode_result(branches[0], Augur.tx.getBranches.returns),
            Augur.branches.dev
        );
    });

    it("send ether to account 1 using sendEther, then to account 2 using web.sendEther", function (done) {
        this.timeout(constants.timeout*2);
        Augur.sendEther(Augur.web.db.get(handle).address, 64, Augur.coinbase,
            function (r) {
                // sent
            },
            function (r) {
                Augur.web.sendEther(handle2, 32);
                done();
            },
            function (r) {
                throw new Error(r.message);
                done();
            }
        );
    });

    it("should sign and send transaction to geth using account 1", function () {
        this.timeout(constants.timeout);
        var user = Augur.web.login(handle, password);
        var tx = utilities.copy(Augur.tx.reputationFaucet);
        tx.params = Augur.branches.dev;
        var txhash = Augur.web.invoke(tx);
        assert(txhash);
        var confirmTx = Augur.getTx(txhash);
        assert(confirmTx.hash);
        assert(confirmTx.from);
        assert(confirmTx.to);
        assert.equal(txhash, confirmTx.hash);
        assert.equal(confirmTx.from, user.address);
        assert.equal(confirmTx.to, tx.to);
    });

    it("should automatically detect login and default to using web.invoke", function (done) {
        this.timeout(constants.timeout);
        var user = Augur.web.login(handle, password);
        Augur.reputationFaucet(
            Augur.branches.dev,
            function (r) {
                // sent
                assert(r.txHash);
                assert.equal(r.callReturn, "1");
                // console.log("sent:", r);
            },
            function (r) {
                // success
                // console.log("success:", r);
                assert.equal(r.from, Augur.web.account.address);
                done();
            },
            function (r) {
                // failed
                throw new Error(r.message);
                done();
            }
        );
    });

    it("should logout and unset the account object", function () {
        this.timeout(constants.timeout);
        var user = Augur.web.login(handle, password);
        assert.equal(user.handle, handle);
        Augur.web.logout();
        assert(!Augur.web.account.handle);
        assert(!Augur.web.account.address);
        assert(!Augur.web.account.privateKey);
        assert(!Augur.web.account.nonce);
    });
});
