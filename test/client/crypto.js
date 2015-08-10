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
var EC = require("elliptic").ec;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var numeric = augur.numeric;
var constants = augur.constants;
var log = console.log;

// create private key, get public key and address
var ecdsa = new EC("secp256k1");
var privateKey = crypto.randomBytes(32);

// generate random handles and passwords
var handle = utils.sha256(new Date().toString());
var password = utils.sha256(Math.random().toString(36).substring(4));
var handle2 = utils.sha256(new Date().toString()).slice(10);
var password2 = utils.sha256(Math.random().toString(36).substring(4)).slice(10);

describe("Crypto", function () {
    var publicKey = new Buffer(ecdsa.keyFromPrivate(privateKey).getPublic("arr"));
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
        assert.strictEqual(decryptedPrivateKey, privateKey.toString("hex"));
    });    

    it("derive address from private key", function () {
        assert.strictEqual(augur.Crypto.privateKeyToAddress(privateKey), "0x" + address);
    });

    // Crypto test vectors:
    // https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition

    // describe("scrypt kdf", function () {)
    //     augur.options.scrypt = true;
    //     augur.connect();
    //     describe("deriveKey", function () {
    //         var test = function (t) {
    //             it("convert " + JSON.stringify(t.input) + " -> " + t.output, function () {
    //                 var derivedKey = augur.Crypto.deriveKey(t.input.password, t.input.salt);
    //                 assert.strictEqual(derivedKey.toString("hex"), t.output);
    //             });
    //         };
    //         test({
    //             input: {
    //                 password: "testpassword",
    //                 salt: "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
    //             },
    //             output: "fac192ceb5fd772906bea3e118a69e8bbb5cc24229e20d8766fd298291bba6bd"
    //         });
    //     });
    // });

    describe("pbkdf2-sha256", function () {
        augur.options.scrypt = false;
        augur.connect();
        describe("deriveKey", function () {
            var test = function (t) {
                it("convert " + JSON.stringify(t.input) + " -> " + t.output, function () {
                    var derivedKey = augur.Crypto.deriveKey(t.input.password, t.input.salt);
                    assert.strictEqual(derivedKey.toString("hex"), t.output);
                });
            };
            test({
                input: {
                    password: "testpassword",
                    salt: "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"
                },
                output: "f06d69cdc7da0faffb1008270bca38f5e31891a3a773950e6d0fea48a7188551"
            });
        });
        describe("getMAC", function () {
            var test = function (t) {
                it("convert " + JSON.stringify(t.input) + " -> " + t.output, function () {
                    var mac = augur.Crypto.getMAC(t.input.derivedKey, t.input.ciphertext);
                    assert.strictEqual(mac, t.output);
                });
            };
            test({
                input: {
                    derivedKey: "f06d69cdc7da0faffb1008270bca38f5e31891a3a773950e6d0fea48a7188551",
                    ciphertext: "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46"
                },
                output: "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"
            });
            test({
                input: {
                    derivedKey: "fac192ceb5fd772906bea3e118a69e8bbb5cc24229e20d8766fd298291bba6bd",
                    ciphertext: "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c"
                },
                output: "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097"
            });
        });
    });
    // describe("dumpPrivateKey", function () {
    //     var derivedKey = "f06d69cdc7da0faffb1008270bca38f5e31891a3a773950e6d0fea48a7188551";
    //     var expected = {
    //         crypto: {
    //             cipher: "aes-128-ctr",
    //             cipherparams: {
    //                 iv: "6087dab2f9fdbbfaddc31a909735c1e6"
    //             },
    //             ciphertext: "5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46",
    //             kdf: "pbkdf2",
    //             kdfparams: {
    //                 c: 262144,
    //                 dklen: 32,
    //                 prf: "hmac-sha256",
    //                 salt: "ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"
    //             },
    //             mac: "517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"
    //         },
    //         id: "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    //         version: 3
    //     };
    // });
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
        assert.strictEqual(serializedTx.slice(0, 144), signed);
        assert.strictEqual(serializedTx.length, 278);

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
        assert.strictEqual(serializedTx.slice(0, 324), signed);
        assert.strictEqual(serializedTx.length, 458)

        // fee = data length in bytes * 5
        //     + 500 Default transaction fee
        //     + gasAmount * gasPrice
        assert.strictEqual(tx.getUpfrontCost().toString(), "100000");
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
        assert.strictEqual(tx2.getSenderAddress().toString("hex"), sender);
        assert(tx2.verifySignature());        
    });

});
