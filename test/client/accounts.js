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
var abi = require("augur-abi");
var utils = require("../../src/utilities");
var db = require("../../src/client/db");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
var log = console.log;

// generate random private key
var privateKey = crypto.randomBytes(32);

// generate random handles and passwords
var handle = utils.sha256(new Date().toString());
var password = utils.sha256(Math.random().toString(36).substring(4));
var handle2 = utils.sha256(new Date().toString()).slice(10);
var password2 = utils.sha256(Math.random().toString(36).substring(4)).slice(10);

var markets = augur.getMarkets(augur.branches.dev);
var market_id = markets[markets.length - 1];

describe("Register", function () {

    it("register account 1: " + handle + " / " + password, function (done) {
        this.timeout(constants.TIMEOUT*4);
        db.get(handle, function (record) {
            assert(record.error);
            assert.strictEqual(record.error, 99);
            augur.web.register(handle, password, function (result) {
                if (result.error) {
                    augur.web.logout();
                    return done(result);
                }
                assert(!result.error);
                assert.property(result, "nonce");
                assert(result.privateKey);
                assert(result.address);
                assert.strictEqual(
                    result.privateKey.toString("hex").length,
                    constants.KEYSIZE*2
                );
                assert.strictEqual(result.address.length, 42);
                db.get(handle, function (rec) {
                    if (rec.error) {
                        augur.web.logout();
                        return done(rec);
                    }
                    assert(!rec.error);
                    assert.property(rec, "nonce");
                    assert(rec.privateKey);
                    assert(rec.iv);
                    assert(rec.salt);
                    assert.strictEqual(
                        new Buffer(rec.iv, "base64")
                            .toString("hex")
                            .length,
                        constants.IVSIZE*2
                    );
                    assert.strictEqual(
                        new Buffer(rec.salt, "base64")
                            .toString("hex")
                            .length,
                        constants.KEYSIZE*2
                    );
                    assert.strictEqual(
                        new Buffer(rec.privateKey, "base64")
                            .toString("hex")
                            .length,
                        constants.KEYSIZE*2
                    );
                    augur.web.logout();
                    done();
                });
            });
        });
    });

    it("register account 2: " + handle2 + " / " + password2, function (done) {
        this.timeout(constants.TIMEOUT*4);
        db.get(handle2, function (record) {
            assert(record.error);
            augur.web.register(handle2, password2, function (result) {
                if (result.error) {
                    augur.web.logout();
                    return done(result);
                }
                assert(!result.error);
                assert.property(result, "nonce");
                assert(result.privateKey);
                assert(result.address);
                assert.strictEqual(
                    result.privateKey.toString("hex").length,
                    constants.KEYSIZE*2
                );
                assert.strictEqual(result.address.length, 42);
                db.get(handle2, function (rec) {
                    if (rec.error) {
                        augur.web.logout();
                        return done(rec);
                    }
                    assert(!rec.error);
                    assert.property(rec, "nonce");
                    assert(rec.privateKey);
                    assert(rec.iv);
                    assert(rec.salt);
                    assert.strictEqual(
                        new Buffer(rec.iv, "base64")
                            .toString("hex")
                            .length,
                        constants.IVSIZE*2
                    );
                    assert.strictEqual(
                        new Buffer(rec.salt, "base64")
                            .toString("hex")
                            .length,
                        constants.KEYSIZE*2
                    );
                    assert.strictEqual(
                        new Buffer(rec.privateKey, "base64")
                            .toString("hex")
                            .length,
                        constants.KEYSIZE*2
                    );
                    augur.web.logout();
                    done();
                });
            });
        });
    });

    it("fail to register account 1's handle again", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.register(handle, password, function (result) {
            assert(!result.privateKey);
            assert(!result.address);
            assert(result.error);
            db.get(handle, function (record) {
                assert(!record.error);
                done();
            });
        });
    });

    it("fail to register account 2's handle again", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.register(handle, password, function (result) {
            assert(!result.privateKey);
            assert(!result.address);
            assert(result.error);
            db.get(handle, function (record) {
                assert(!record.error);
                done();
            });
        });
    });

});

describe("Login", function () {

    it("login and decrypt the stored private key", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.login(handle, password, function (user) {
            if (user.error) {
                augur.web.logout();
                return done(user);
            }
            assert(!user.error);
            assert.property(user, "nonce");
            assert(user.privateKey);
            assert(user.address);
            assert.strictEqual(
                user.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(user.address.length, 42);
            augur.web.logout();
            done();
        });
    });

    it("login twice as the same user", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.login(handle, password, function (user) {
            if (user.error) {
                augur.web.logout();
                return done(user);
            }
            assert.property(user, "nonce");
            assert(user.privateKey);
            assert(user.address);
            assert.strictEqual(
                user.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(user.address.length, 42);
            augur.web.login(handle, password, function (same_user) {
                if (same_user.error) {
                    augur.web.logout();
                    return done(same_user);
                }
                assert(!same_user.error);
                assert.strictEqual(
                    user.privateKey.toString("hex"),
                    same_user.privateKey.toString("hex")
                );
                assert.strictEqual(user.address, same_user.address);
                done();
            });
        });
    });

    it("fail with error 403 when given an incorrect handle", function (done) {
        this.timeout(constants.TIMEOUT);
        var bad_handle = utils.sha256(new Date().toString());
        augur.web.login(bad_handle, password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given a blank handle", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.login("", password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given a blank password", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.login(handle, "", function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given a blank handle and a blank password", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.login("", "", function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given an incorrect password", function (done) {
        this.timeout(constants.TIMEOUT);
        var bad_password = utils.sha256(Math.random().toString(36).substring(4));
        augur.web.login(handle, bad_password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given an incorrect handle and an incorrect password", function (done) {
        this.timeout(constants.TIMEOUT);
        var bad_handle = utils.sha256(new Date().toString());
        var bad_password = utils.sha256(Math.random().toString(36).substring(4));
        augur.web.login(handle, bad_password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

});

describe("Logout", function () {

    it("logout and unset the account object", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.web.login(handle, password, function (user) {
            if (user.error) {
                augur.web.logout();
                return done(user);
            }
            assert.strictEqual(user.handle, handle);
            for (var i = 0; i < 2; ++i) {
                augur.web.logout();
                assert.notProperty(augur.web.account, "handle");
                assert.notProperty(augur.web.account, "address");
                assert.notProperty(augur.web.account, "privateKey");
                assert.notProperty(augur.web.account, "nonce");
            }
            done();
        });
    });

});

describe("Fund", function () {

    var recipient = "0x639b41c4d3d399894f2a57894278e1653e7cd24c";

    it("send " + constants.FREEBIE + " ether to " + recipient, function (done) {

        this.timeout(constants.TIMEOUT*4);

        var initial_balance = abi
            .bignum(augur.rpc.balance(recipient))
            .dividedBy(constants.ETHER);

        augur.web.fund(
            { address: recipient },
            function (account) {
                if (account.error) {
                    augur.web.logout();
                    return done(account);
                }
                assert.property(account, "address");
                assert.strictEqual(account.address, recipient);
            }, function (account) {
                if (account.error) {
                    augur.web.logout();
                    return done(account);
                }
                assert.property(account, "address");
                assert.strictEqual(account.address, recipient);

                var final_balance = abi
                    .bignum(augur.rpc.balance(recipient))
                    .dividedBy(constants.ETHER);

                var delta = final_balance.sub(initial_balance).toNumber();
                assert.isAbove(Math.abs(delta), 49);

                done();
            }
        );
    });

});

describe("Transaction signing", function () {

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

        // RLP serialization
        var serializedTx = tx.serialize().toString("hex");
        assert.strictEqual(serializedTx.slice(0, 144), signed);
        assert.strictEqual(serializedTx.length, 278);
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

describe("Contract methods", function () {

    describe("Call", function () {

        it("call getBranches using web.invoke", function (done) {
            this.timeout(constants.TIMEOUT);
            augur.web.login(handle, password, function (user) {
                if (user.error) {
                    augur.web.logout();
                    return done(user);
                }
                assert.strictEqual(
                    user.address,
                    augur.web.account.address
                );

                // sync
                var branches = augur.web.invoke(augur.tx.getBranches);
                console.log(branches);
                console.log("encoded:", augur.rpc.encodeResult(
                    branches[0],
                    augur.tx.getBranches.returns
                ));
                assert.isAbove(branches.length, 0);
                assert.isArray(branches);
                assert.strictEqual(
                    augur.rpc.encodeResult(
                        branches[0],
                        augur.tx.getBranches.returns
                    ),
                    augur.branches.dev
                );

                // async
                augur.web.invoke(augur.tx.getBranches, function (branches) {
                    console.log("async:", branches);
                    assert.isAbove(branches.length, 0);
                    assert.isArray(branches);
                    assert.strictEqual(
                        augur.rpc.encodeResult(
                            branches[0],
                            augur.tx.getBranches.returns
                        ),
                        augur.branches.dev
                    );
                    augur.web.logout();
                    done();
                });
            });
        });

    });

    describe("Send transaction", function () {

        it("sign and send transaction using account 1", function (done) {
            this.timeout(constants.TIMEOUT);
            augur.web.login(handle, password, function (user) {
                if (user.error) {
                    augur.web.logout();
                    return done(user);
                }
                var tx = utils.copy(augur.tx.reputationFaucet);
                tx.params = augur.branches.dev;
                augur.web.invoke(tx, function (txhash) {
                    if (txhash.error) {
                        augur.web.logout();
                        return done(txhash);
                    }
                    assert(txhash);
                    augur.rpc.getTx(txhash, function (confirmTx) {
                        if (confirmTx.error) {
                            augur.web.logout();
                            return done(confirmTx);
                        }
                        assert(confirmTx.hash);
                        assert(confirmTx.from);
                        assert(confirmTx.to);
                        assert.strictEqual(txhash, confirmTx.hash);
                        assert.strictEqual(confirmTx.from, user.address);
                        assert.strictEqual(confirmTx.to, tx.to);
                        augur.web.logout();
                        done();
                    });
                });
            });
        });

        it("detect logged in user and default to web.invoke", function (done) {
            this.timeout(constants.TIMEOUT*12);
            augur.web.login(handle, password, function (user) {
                if (user.error) {
                    augur.web.logout();
                    return done(user);
                }
                assert.strictEqual(
                    user.address,
                    augur.web.account.address
                );
                augur.cashFaucet({
                    onSent: function (r) {
                        // sent
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                    },
                    onSuccess: function (r) {
                        // success
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.property(r, "blockHash");
                        assert.property(r, "blockNumber");
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.strictEqual(r.from, user.address);
                        assert.strictEqual(r.to, augur.contracts.faucets);
                        assert.strictEqual(parseInt(r.value), 0);
                        done();
                    },
                    onFailed: function (r) {
                        // failed
                        done(r);
                    }
                });
            });
        });

    });

});

// describe("Send Ether", function () {

//     var amount = 64;

//     it("coinbase -> account 1 [" + amount + "]", function (done) {
//         this.timeout(constants.TIMEOUT);
//         db.get(handle, function (toAccount) {
//             augur.sendEther(
//                 toAccount.address,
//                 amount,
//                 augur.coinbase,
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
//         augur.web.login(handle, password, function (user) {
//             augur.web.sendEther(
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
//         db.get(handle, function (toAccount) {
//             augur.sendCash(
//                 toAccount.address,
//                 amount,
//                 augur.coinbase,
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
//         augur.web.login(handle, password, function (user) {
//             augur.web.sendCash(
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
//         db.get(handle, function (toAccount) {
//             augur.sendReputation(
//                 augur.branches.dev,
//                 toAccount.address,
//                 amount,
//                 augur.coinbase,
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
//         augur.web.login(handle, password, function (user) {
//             augur.web.sendReputation(
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
