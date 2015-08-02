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
var constants = require("../../src/constants");
var utilities = require("../../src/utilities");
var Augur = utilities.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

// create private key, get public key and address
var privateKey = crypto.randomBytes(32);

// generate random handles and passwords
var handle = utilities.sha256(new Date().toString());
var password = utilities.sha256(Math.random().toString(36).substring(4));
var handle2 = utilities.sha256(new Date().toString()).slice(10);
var password2 = utilities.sha256(Math.random().toString(36).substring(4)).slice(10);

describe("Crypto", function () {
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
        assert.strictEqual(decryptedPrivateKey, privateKey.toString("hex"));
    });    

    it("derive address from private key", function () {
        assert.strictEqual(Augur.web.privateKeyToAddress(privateKey), "0x" + address);
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

describe("Database", function () {

    var account = {
        handle: "tinybike",
        privateKey: "deadbeef",
        iv: "zombeef",
        nonce: 0
    };

    describe("Firebase", function () {

        it("save account", function (done) {
            Augur.web.db.put(account.handle, account, function (url) {
                assert.strictEqual(url, constants.FIREBASE_URL + "/" + account.handle);
                done();
            });
        });

        it("retrieve account", function (done) {
            Augur.web.db.get(account.handle, function (retrieved_account) {
                assert.strictEqual(account.handle, retrieved_account.handle);
                assert.strictEqual(account.privateKey, retrieved_account.privateKey);
                assert.strictEqual(account.iv, retrieved_account.iv);
                assert.strictEqual(account.nonce, retrieved_account.nonce);
                done();
            });
        });

    });

    describe("Ethereum LevelDB", function () {

        it("save account", function (done) {
            Augur.web.leveldb.put(account.handle, account);
            done();
        });

        it("retrieve account", function (done) {
            Augur.web.leveldb.get(account.handle, function (retrieved_account) {
                assert.strictEqual(account.handle, retrieved_account.handle);
                assert.strictEqual(account.privateKey, retrieved_account.privateKey);
                assert.strictEqual(account.iv, retrieved_account.iv);
                assert.strictEqual(account.nonce, retrieved_account.nonce);
                done();
            });
        });

    });

});

describe("Accounts", function () {

    describe("Register", function () {

        it("register account 1: " + handle + " / " + password, function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.db.get(handle, function (record) {
                assert(record.error);
                assert.strictEqual(record.error, 99);
                Augur.web.register(handle, password, function (result) {
                    assert(result.privateKey);
                    assert(result.address);
                    assert(!result.error);
                    Augur.web.db.get(handle, function (rec) {
                        assert(!rec.error);
                        done();
                    });
                });
            });
        });

        it("register account 2: " + handle2 + " / " + password2, function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.db.get(handle2, function (record) {
                assert(record.error);
                Augur.web.register(handle2, password2, function (result) {
                    assert(result.privateKey);
                    assert(result.address);
                    assert(!result.error);
                    Augur.web.db.get(handle2, function (rec) {
                        assert(!rec.error);
                        done();
                    });
                });
            });
        });

        it("fail to register account 1's handle again", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.register(handle, password, function (result) {
                assert(!result.privateKey);
                assert(!result.address);
                assert(result.error);
                Augur.web.db.get(handle, function (record) {
                    assert(!record.error);
                    done();
                });
            });
        });

    });

    describe("Login/logout", function () {

        it("login and decrypt the stored private key", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.login(handle, password, function (user) {
                assert(!user.error);
                assert(user.privateKey);
                assert(user.address);
                assert.strictEqual(user.privateKey.toString("hex").length, 64);
                assert.strictEqual(user.address.length, 42);
                Augur.web.login(handle, password, function (same_user) {
                    assert(!same_user.error);
                    assert.strictEqual(user.privateKey.toString("hex"), same_user.privateKey.toString("hex"));
                    assert.strictEqual(user.address, same_user.address);
                    done();
                });
            });
        });

        it("fail with error 403 when given an incorrect handle", function (done) {
            this.timeout(constants.TIMEOUT);
            var bad_handle = utilities.sha256(new Date().toString());
            Augur.web.login(bad_handle, password, function (user) {
                assert.strictEqual(user.error, 403);
                done();
            });
        });

        it("fail with error 403 when given an incorrect password", function (done) {
            this.timeout(constants.TIMEOUT);
            var bad_password = utilities.sha256(Math.random().toString(36).substring(4));
            Augur.web.login(handle, bad_password, function (user) {
                assert.strictEqual(user.error, 403);
                done();
            });
        });

        it("fail with error 403 when given an incorrect handle and an incorrect password", function (done) {
            this.timeout(constants.TIMEOUT);
            var bad_handle = utilities.sha256(new Date().toString());
            var bad_password = utilities.sha256(Math.random().toString(36).substring(4));
            Augur.web.login(handle, bad_password, function (user) {
                assert.strictEqual(user.error, 403);
                done();
            });
        });

        it("logout and unset the account object", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.login(handle, password, function (user) {
                assert.strictEqual(user.handle, handle);
                Augur.web.logout();
                assert(!Augur.web.account.handle);
                assert(!Augur.web.account.address);
                assert(!Augur.web.account.privateKey);
                assert(!Augur.web.account.nonce);
                done();
            });
        });

    });

    // describe("Send Ether", function () {

    //     var amount = 64;

    //     it("coinbase -> account 1 [" + amount + "]", function (done) {
    //         this.timeout(constants.TIMEOUT);
    //         Augur.web.db.get(handle, function (toAccount) {
    //             Augur.sendEther(
    //                 toAccount.address,
    //                 amount,
    //                 Augur.coinbase,
    //                 function (r) {
    //                     // sent
    //                     // log("sent:", r);
    //                 },
    //                 function (r) {
    //                     // log("success:", r);
    //                     done();
    //                 },
    //                 function (r) {
    //                     r.name = r.error; throw r;
    //                     done(r);
    //                 }
    //             );
    //         });
    //     });

    //     it("account 1 -> account 2 [" + amount / 2 + "]", function (done) {
    //         this.timeout(constants.TIMEOUT);
    //         Augur.web.login(handle, password, function (user) {
    //             Augur.web.sendEther(
    //                 handle2,
    //                 amount / 2,
    //                 function (r) {
    //                     log("sent:", r);
    //                 },
    //                 function (r) {
    //                     log("success:", r);
    //                     done();
    //                 },
    //                 function (r) {
    //                     done(r);
    //                 }
    //             );
    //         });
    //     });

    // });

    // describe("Send Cash", function () {

    //     var amount = 10;

    //     it("coinbase -> account 1 [" + amount + "]", function (done) {
    //         this.timeout(constants.TIMEOUT);
    //         Augur.web.db.get(handle, function (toAccount) {
    //             Augur.sendCash(
    //                 toAccount.address,
    //                 amount,
    //                 Augur.coinbase,
    //                 function (r) {
    //                     // sent
    //                 },
    //                 function (r) {
    //                     done();
    //                 },
    //                 function (r) {
    //                     r.name = r.error; throw r;
    //                     done(r);
    //                 }
    //             );
    //         });
    //     });

    //     it("account 1 -> account 2 [" + amount / 2 + "]", function (done) {
    //         this.timeout(constants.TIMEOUT);
    //         Augur.web.login(handle, password, function (user) {
    //             Augur.web.sendCash(
    //                 handle2,
    //                 amount / 2,
    //                 function (r) {
    //                     log("sent:", r);
    //                 },
    //                 function (r) {
    //                     log("success:", r);
    //                     done();
    //                 },
    //                 function (r) {
    //                     r.name = r.error; throw r;
    //                     done();
    //                 }
    //             );
    //         });
    //     });

    // });

    // describe("Send Reputation", function () {

    //     var amount = 2;

    //     it("coinbase -> account 1 [" + amount + "]", function (done) {
    //         this.timeout(constants.TIMEOUT);
    //         Augur.web.db.get(handle, function (toAccount) {
    //             Augur.sendReputation(
    //                 Augur.branches.dev,
    //                 toAccount.address,
    //                 amount,
    //                 Augur.coinbase,
    //                 function (r) {
    //                     // sent
    //                 },
    //                 function (r) {
    //                     done();
    //                 },
    //                 function (r) {
    //                     r.name = r.error; throw r;
    //                     done(r);
    //                 }
    //             );
    //         });
    //     });

    //     it("account 1 -> account 2 [" + amount / 2 + "]", function (done) {
    //         this.timeout(constants.TIMEOUT);
    //         Augur.web.login(handle, password, function (user) {
    //             Augur.web.sendReputation(
    //                 handle2,
    //                 amount / 2,
    //                 function (r) {
    //                     log("sent:", r);
    //                 },
    //                 function (r) {
    //                     log("success:", r);
    //                     done();
    //                 },
    //                 function (r) {
    //                     r.name = r.error; throw r;
    //                     done();
    //                 }
    //             );
    //         });
    //     });

    // });

    describe("Contract methods", function () {

        describe("Call", function () {

            it("call getBranches using web.invoke", function (done) {
                this.timeout(constants.TIMEOUT);
                Augur.web.login(handle, password, function (user) {

                    // sync
                    var branches = Augur.web.invoke(Augur.tx.getBranches);
                    assert(branches.length);
                    assert.strictEqual(branches.constructor, Array);
                    assert.strictEqual(
                        Augur.encode_result(branches[0], Augur.tx.getBranches.returns),
                        Augur.branches.dev
                    );

                    // async
                    Augur.web.invoke(Augur.tx.getBranches, function (branches) {
                        assert(branches.length);
                        assert.strictEqual(branches.constructor, Array);
                        assert.strictEqual(
                            Augur.encode_result(branches[0], Augur.tx.getBranches.returns),
                            Augur.branches.dev
                        );
                        done();
                    });
                });
            });
        
        });

        describe("Send transaction", function () {

            it("send ether from coinbase to account 1", function (done) {
                var amount = 64;
                this.timeout(constants.TIMEOUT);
                Augur.web.login(handle, password, function (toAccount) {
                    Augur.sendEther(
                        toAccount.address,
                        amount,
                        Augur.coinbase,
                        function (r) {
                            // sent
                        },
                        function (r) {
                            done();
                        },
                        function (r) {
                            r.name = r.error; throw r;
                            done(r);
                        }
                    );
                });
            });

            it("detect logged in user and default to web.invoke", function (done) {
                this.timeout(constants.TIMEOUT);
                Augur.web.login(handle, password, function (user) {
                    assert.strictEqual(user.address, Augur.web.account.address);
                    Augur.reputationFaucet(
                        Augur.branches.dev,
                        function (r) {
                            // sent
                            assert(r.txHash);
                            assert.strictEqual(r.callReturn, "1");
                        },
                        function (r) {
                            // success
                            assert.strictEqual(r.from, Augur.web.account.address);
                            assert.strictEqual(r.from, user.address);
                            assert(r.blockHash);
                            done();
                        },
                        function (r) {
                            // failed
                            done(r);
                        }
                    );
                });
            });

            it("sign and send transaction using account 1", function (done) {
                this.timeout(constants.TIMEOUT);
                Augur.web.login(handle, password, function (user) {
                    var tx = utilities.copy(Augur.tx.reputationFaucet);
                    tx.params = Augur.branches.dev;
                    Augur.web.invoke(tx, function (txhash) {
                        assert(txhash);
                        Augur.getTx(txhash, function (confirmTx) {
                            assert(confirmTx.hash);
                            assert(confirmTx.from);
                            assert(confirmTx.to);
                            assert.strictEqual(txhash, confirmTx.hash);
                            assert.strictEqual(confirmTx.from, user.address);
                            assert.strictEqual(confirmTx.to, tx.to);
                            done();                    
                        });
                    });
                });
            });

        });
    });
});
