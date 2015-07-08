/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var chalk = require("chalk");
// var Ethereum = require("ethereumjs-lib");
var Transaction = require("ethereumjs-tx");
var EthUtil = require("ethereumjs-util");
// var rlp = require("rlp");
var elliptic = require("eccrypto");
var constants = require("./constants");
var utilities = require("./utilities");
var Augur = utilities.setup(require("../augur"), process.argv.slice(2));
var log = console.log;

// create private key, get public key and address
var privateKey = crypto.randomBytes(32);

describe("Accounts", function () {
    var publicKey = elliptic.getPublic(privateKey);
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
    
    // log("Private key:  ", chalk.green(privateKey.toString("hex")));
    // log("Address:      ", chalk.green(address));
    // log("Handle:       ", chalk.red(handle));
    // log("Password:     ", chalk.red(password));
    // log("Encrypted key:", chalk.cyan(encryptedPrivateKey));
});

describe("Transactions", function () {

    // sign tx with private key
    it("sign raw transaction using private key", function () {
        var tx = new Transaction({
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

        // log("Serialized tx:", chalk.green(tx.serialize().toString("hex")));
    });

    // create a new contract
    it("transaction to create a new contract", function () {
        var tx = new Transaction();
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

        // log("Serialized tx:", chalk.green(tx.serialize().toString("hex")));
        // log("Total fee:    ", chalk.green(tx.getUpfrontCost().toString()), chalk.gray("wei"));
    });

    // decode incoming tx using rlp: rlp.decode(itx)
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
        var tx2 = new Transaction(rawTx);
        var sender = "1f36f546477cda21bf2296c50976f2740247906f";
        assert.equal(tx2.getSenderAddress().toString("hex"), sender);
        assert(tx2.verifySignature());
        
        // also need to check sender's account to see if they have at least amount of the fee
        // log("Sender:        " + chalk.green(tx2.getSenderAddress().toString("hex")));
    });

});

describe("Web client", function () {

    // generate random handle and password
    var handle = utilities.sha256(new Date().toString()).slice(2);
    var password = utilities.sha256(Math.random().toString(36).substring(4)).slice(2);

    it("should register successfully: " + handle + " / " + password, function () {
        this.timeout(constants.timeout);
        assert(Augur.getString(handle).error);
        var result = Augur.web.register(handle, password);
        assert(result.privateKey);
        assert(result.address);
        assert(!result.error);
        assert(!Augur.getString(handle).error);
    });

    it("should fail to register the same handle again", function () {
        this.timeout(constants.timeout);
        var result = Augur.web.register(handle, password);
        assert(!result.privateKey);
        assert(!result.address);
        assert(result.error);
        assert(!Augur.getString(handle).error);
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
        var bad_handle = utilities.sha256(new Date().toString()).slice(2);
        assert.equal(Augur.web.login(bad_handle, password).error, 403);
    });

    it("should fail with error 403 when given an incorrect password", function () {
        this.timeout(constants.timeout);
        var bad_password = utilities.sha256(Math.random().toString(36).substring(4)).slice(2);
        assert.equal(Augur.web.login(handle, bad_password).error, 403);
    });

    it("should fail with error 403 when given an incorrect handle and an incorrect password", function () {
        this.timeout(constants.timeout);
        var bad_handle = utilities.sha256(new Date().toString()).slice(2);
        var bad_password = utilities.sha256(Math.random().toString(36).substring(4)).slice(2);
        assert.equal(Augur.web.login(handle, bad_password).error, 403);
    });
});
