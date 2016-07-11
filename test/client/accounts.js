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
var utils = require("../../src/utilities");
var constants = require("../../src/constants");
var tools = require("../tools");
var augur = tools.setup(require("../../src"), process.argv.slice(2));

// generate random private key
var privateKey = crypto.randomBytes(32);
var address = keys.privateKeyToAddress(privateKey);

// generate random names and passwords
var name = utils.sha256(new Date().toString());
var password = utils.sha256(Math.random().toString(36).substring(4));
var secureLoginID;
var name2 = utils.sha256(new Date().toString()).slice(10) + "@" +
    utils.sha256(new Date().toString()).slice(10) + ".com";
var password2 = utils.sha256(Math.random().toString(36).substring(4)).slice(10);
var secureLoginID2;
// var name3 = utils.sha256(Math.random().toString(36).substring(4)).slice(0, 7);
// var password3 = utils.sha256(Math.random().toString(36).substring(4)).slice(0, 7);

var markets = augur.getMarketsInBranch(augur.constants.DEFAULT_BRANCH_ID);
var market_id = markets[markets.length - 1];

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

describe("Register", function () {
    it("register account 1: " + name + " / " + password, function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
          augur.web.register(name, password, function (result) {
            checkAccount(augur, result, true);
						secureLoginID = result.secureLoginID;
						var rec = result.keystore;
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
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
          augur.web.register(name2, password2, function (result) {
            checkAccount(augur, result, true);
						secureLoginID2 = result.secureLoginID;
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
		// Don't think we need this anymore because we wont be using presistence
    // it("persistent register: " + name3 + " / " + password3, function (done) {
    //     this.timeout(tools.TIMEOUT);
    //     var augur = tools.setup(require("../../src"), process.argv.slice(2));
    //     augur.db.get(name3, function (record) {
    //         assert.strictEqual(record.error, 99);
    //         augur.web.register(name3, password3, {
    //             doNotFund: true,
    //             persist: true
    //         }, function (result) {
    //             if (result && result.error) {
    //                 augur.web.logout();
    //                 return done(result);
    //             }
    //             assert(!result.error);
    //             assert(result.privateKey);
    //             assert(result.address);
    //             assert.strictEqual(
    //                 result.privateKey.toString("hex").length,
    //                 constants.KEYSIZE*2
    //             );
    //             assert.strictEqual(result.address.length, 42);
    //             augur.db.get(name3, function (rec) {
    //                 if (rec && rec.error) {
    //                     augur.web.logout();
    //                     return done(rec);
    //                 }
    //                 assert(!rec.error);
    //                 assert(rec.crypto.ciphertext);
    //                 assert(rec.crypto.cipherparams.iv);
    //                 assert(rec.crypto.kdfparams.salt);
    //                 assert.isObject(augur.web.account.keystore);
    //                 assert.strictEqual(
    //                     rec.crypto.cipherparams.iv.length,
    //                     constants.IVSIZE*2
    //                 );
    //                 assert.strictEqual(
    //                     rec.crypto.kdfparams.salt.length,
    //                     constants.KEYSIZE*2
    //                 );
    //                 assert.strictEqual(
    //                     rec.crypto.ciphertext.length,
    //                     constants.KEYSIZE*2
    //                 );
    //                 var stored = augur.db.get('');
    //                 assert.strictEqual(stored.name, name3);
    //                 assert.strictEqual(abi.hex(stored.privateKey), abi.hex(augur.web.account.privateKey));
    //                 assert.strictEqual(stored.address, augur.web.account.address);
    //                 assert.isObject(stored.keystore);
    //                 assert.isObject(augur.web.account.keystore);
    //                 assert.deepEqual(stored.keystore, augur.web.account.keystore);
    //                 augur.web.logout();
    //                 done();
    //             });
    //         });
    //     });
    // });
});

describe("Login", function () {

    it("login and decrypt the stored private key", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login(secureLoginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
            assert.isString(user.address);
            assert.isObject(user.keystore);
            assert.strictEqual(
                augur.web.account.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(user.address.length, 42);
            augur.web.logout();
            done();
        });
    });

    // it("persistent login", function (done) {
    //     this.timeout(tools.TIMEOUT);
    //     var augur = tools.setup(require("../../src"), process.argv.slice(2));
    //     augur.web.login(name, password, {persist: true}, function (user) {
    //         assert.notProperty(user, "error");
    //         assert.isTrue(Buffer.isBuffer(user.privateKey));
    //         assert.isString(user.address);
    //         assert.isObject(user.keystore);
    //         assert.strictEqual(
    //             user.privateKey.toString("hex").length,
    //             constants.KEYSIZE*2
    //         );
    //         assert.strictEqual(user.address.length, 42);
    //         var stored = augur.db.getPersistent();
    //         assert.strictEqual(stored.name, name);
    //         assert.strictEqual(abi.hex(stored.privateKey, true), abi.hex(augur.web.account.privateKey, true));
    //         assert.strictEqual(stored.address, augur.web.account.address);
    //         augur.web.logout();
    //         done();
    //     });
    // });

    it("login twice as the same user", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login(secureLoginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
            assert.isString(user.address);
            assert.isObject(user.keystore);
            assert.strictEqual(
                augur.web.account.privateKey.toString("hex").length,
                constants.KEYSIZE*2
            );
            assert.strictEqual(user.address.length, 42);
            augur.web.login(secureLoginID, password, function (same_user) {
                assert(!same_user.error);
								// since we no longer pass privateKey out to the callback of login, we cannot check if the two objects sent the correct key.
                // assert.strictEqual(
                //     user.privateKey.toString("hex"),
                //     same_user.privateKey.toString("hex")
                // );
                assert.strictEqual(user.address, same_user.address);
                done();
            });
        });
    });

    it("fail with error 403 when given an incorrect secureLoginID", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        var bad_secureLoginID = utils.sha256(new Date().toString());
        augur.web.login(bad_secureLoginID, password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given a blank secureLoginID", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login("", password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given a blank password", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login(secureLoginID, "", function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given a blank secureLoginID and a blank password", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login("", "", function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given an incorrect password", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        var bad_password = utils.sha256(Math.random().toString(36).substring(4));
        augur.web.login(secureLoginID, bad_password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

    it("fail with error 403 when given an incorrect secureLoginID and an incorrect password", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        var bad_secureLoginID = utils.sha256(new Date().toString());
        var bad_password = utils.sha256(Math.random().toString(36).substring(4));
        augur.web.login(bad_secureLoginID, bad_password, function (user) {
            assert.strictEqual(user.error, 403);
            done();
        });
    });

});
// Persistence is no longer possible since we are moving away from local storage.
// describe("Persist", function () {
//
//     it("use a stored (persistent) account", function (done) {
//         this.timeout(tools.TIMEOUT);
//         augur.web.logout();
//         assert.isTrue(augur.db.removePersistent());
//         assert.notProperty(augur.web.account, "name");
//         assert.notProperty(augur.web.account, "address");
//         assert.notProperty(augur.web.account, "privateKey");
//         assert.notProperty(augur.web.account, "keystore");
//         assert.isNull(augur.db.getPersistent());
//         var name = utils.sha256(new Date().toString()).slice(0, 10);
//         var password = "tinypassword";
//         augur.web.register(name, password, {doNotFund: true}, function (account) {
//             assert.notProperty(account, "error");
//             assert.isTrue(augur.db.putPersistent(account));
//             var persist = augur.web.persist();
//             assert.strictEqual(persist.name, account.name);
//             assert.strictEqual(persist.privateKey.toString("hex"), account.privateKey.toString("hex"));
//             assert.strictEqual(persist.address, account.address);
//             assert.strictEqual(augur.web.account.name, account.name);
//             assert.strictEqual(augur.web.account.privateKey.toString("hex"), account.privateKey.toString("hex"));
//             assert.strictEqual(augur.web.account.address, account.address);
//             assert.isObject(augur.web.account.keystore);
//             augur.web.logout();
//             assert.notProperty(augur.web.account, "name");
//             assert.notProperty(augur.web.account, "address");
//             assert.notProperty(augur.web.account, "privateKey");
//             assert.notProperty(augur.web.account, "keystore");
//             assert.isNull(augur.db.getPersistent());
//             done();
//         });
//     });
//
// });

describe("Logout", function () {

    it("logout and unset the account object", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login(secureLoginID, password, function (user) {
            if (user.error) {
                augur.web.logout();
                return done(new Error(tools.pp(user)));
            }
            assert.strictEqual(user.secureLoginID, secureLoginID);
            for (var i = 0; i < 2; ++i) {
                augur.web.logout();
                assert.notProperty(augur.web.account, "secureLoginID");
                assert.notProperty(augur.web.account, "address");
                assert.notProperty(augur.web.account, "privateKey");
            }
            assert.isNull(augur.db.getPersistent());
            done();
        });
    });

});

if (process.env.AUGURJS_INTEGRATION_TESTS) {
		// Should be impossible to have duplicate accounts now with secureLoginID...
		// and no presistence.
    // describe("Duplicate accounts", function () {
        // it("account 1 + same password", function (done) {
        //     this.timeout(tools.TIMEOUT);
        //     var augur = tools.setup(require("../../src"), process.argv.slice(2));
        //     augur.web.register(name, password, function (result) {
				// 				console.log(result);
        //         assert.strictEqual(result.error, 422);
        //         assert.notProperty(result, "address");
        //         assert.notProperty(result, "privateKey");
        //         assert.notProperty(result, "keystore");
        //         assert.notProperty(result, "secureLoginID");
        //         // assert.notProperty(augur.web.account, "address");
        //         // assert.notProperty(augur.web.account, "privateKey");
        //         // assert.notProperty(augur.web.account, "keystore");
        //         // assert.notProperty(augur.web.account, "secureLoginID");
        //         augur.db.get(secureLoginID, function (record) {
        //             assert.isObject(record);
        //             assert.notProperty(record, "error");
        //             augur.web.register(secureLoginID, password, function (result) {
        //                 assert.strictEqual(result.error, 422);
        //                 assert.notProperty(result, "address");
        //                 assert.notProperty(result, "privateKey");
        //                 assert.notProperty(result, "keystore");
        //                 assert.notProperty(result, "secureLoginID");
        //                 assert.notProperty(augur.web.account, "address");
        //                 assert.notProperty(augur.web.account, "privateKey");
        //                 assert.notProperty(augur.web.account, "keystore");
        //                 assert.notProperty(augur.web.account, "secureLoginID");
        //                 // augur.db.get(secureLoginID, function (record) {
        //                     // assert.isObject(record);
        //                     // assert.notProperty(record, "error");
				//
        //                     // verify login with correct password still works
        //                     augur.web.login(secureLoginID, password, function (user) {
        //                         assert.notProperty(user, "error");
        //                         assert.isTrue(Buffer.isBuffer(user.privateKey));
        //                         assert.isString(user.address);
        //                         assert.isObject(user.keystore);
        //                         assert.strictEqual(
        //                             user.privateKey.toString("hex").length,
        //                             constants.KEYSIZE*2
        //                         );
        //                         assert.strictEqual(user.address.length, 42);
        //                         augur.web.logout();
				//
        //                         // verify login with bad password does not work
        //                         augur.web.login(secureLoginID, password + "1", function (user) {
        //                             assert.strictEqual(user.error, 403);
        //                             assert.notProperty(user, "address");
        //                             assert.notProperty(user, "privateKey");
        //                             assert.notProperty(user, "keystore");
        //                             assert.notProperty(user, "secureLoginID");
        //                             assert.notProperty(augur.web.account, "address");
        //                             assert.notProperty(augur.web.account, "privateKey");
        //                             assert.notProperty(augur.web.account, "keystore");
        //                             assert.notProperty(augur.web.account, "secureLoginID");
        //                             done();
        //                         });
        //                     });
        //                 // });
        //             });
        //         });
        //     });
        // });

        // it("account 2 + different password", function (done) {
        //     this.timeout(tools.TIMEOUT);
        //     var augur = tools.setup(require("../../src"), process.argv.slice(2));
        //     var badPassword = password2 + "1";
        //     augur.web.register(name2, badPassword, {doNotFund: true}, function (result) {
        //         assert.strictEqual(result.error, 422);
        //         assert.notProperty(result, "address");
        //         assert.notProperty(result, "privateKey");
        //         assert.notProperty(result, "keystore");
        //         assert.notProperty(result, "name");
        //         assert.notProperty(augur.web.account, "address");
        //         assert.notProperty(augur.web.account, "privateKey");
        //         assert.notProperty(augur.web.account, "keystore");
        //         assert.notProperty(augur.web.account, "name");
        //         augur.db.get(name2, function (record) {
        //             assert.isObject(record);
        //             assert.notProperty(record, "error");
        //             augur.web.register(name2, badPassword, {
        //                 doNotFund: true,
        //                 persist: true
        //             }, function (result) {
        //                 assert.strictEqual(result.error, 422);
        //                 assert.notProperty(result, "address");
        //                 assert.notProperty(result, "privateKey");
        //                 assert.notProperty(result, "keystore");
        //                 assert.notProperty(result, "name");
        //                 assert.notProperty(augur.web.account, "address");
        //                 assert.notProperty(augur.web.account, "privateKey");
        //                 assert.notProperty(augur.web.account, "keystore");
        //                 assert.notProperty(augur.web.account, "name");
        //                 augur.db.get(name2, function (record) {
        //                     assert.isObject(record);
        //                     assert.notProperty(record, "error");
				//
        //                     // verify login with correct password still works
        //                     augur.web.login(name2, password2, function (user) {
        //                         assert.notProperty(user, "error");
        //                         assert.isTrue(Buffer.isBuffer(user.privateKey));
        //                         assert.isString(user.address);
        //                         assert.isObject(user.keystore);
        //                         assert.strictEqual(
        //                             user.privateKey.toString("hex").length,
        //                             constants.KEYSIZE*2
        //                         );
        //                         assert.strictEqual(user.address.length, 42);
        //                         augur.web.logout();
				//
        //                         // verify login with bad password does not work
        //                         augur.web.login(name2, badPassword, function (user) {
        //                             assert.strictEqual(user.error, 403);
        //                             assert.notProperty(user, "address");
        //                             assert.notProperty(user, "privateKey");
        //                             assert.notProperty(user, "keystore");
        //                             assert.notProperty(user, "name");
        //                             assert.notProperty(augur.web.account, "address");
        //                             assert.notProperty(augur.web.account, "privateKey");
        //                             assert.notProperty(augur.web.account, "keystore");
        //                             assert.notProperty(augur.web.account, "name");
        //                             done();
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // });
    // });

    describe("Fund new account", function () {

        it("Faucet: funding sequence: " + secureLoginID, function (done) {
            this.timeout(tools.TIMEOUT*4);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            augur.web.login(secureLoginID, password, function (account) {
                // console.log("login:", account);
                checkAccount(augur, account);
                var recipient = account.address;
                var initial_balance = abi
                    .bignum(augur.rpc.balance(recipient))
                    .dividedBy(constants.ETHER);
                // console.log("initial balance:", initial_balance.toFixed());
                augur.web.fundNewAccountFromFaucet(recipient, augur.constants.DEFAULT_BRANCH_ID,
                    function (res) {
                        assert.notProperty(res, "error");
                        assert.strictEqual(res.callReturn, "1");
                    },
                    function (response) {
                        assert.notProperty(response, "error");
                        assert.strictEqual(response.callReturn, "1");
                        augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, recipient, function (repBalance) {
                            assert.notProperty(repBalance, "error");
                            assert.strictEqual(abi.number(repBalance), 47);
                            augur.getCashBalance(recipient, function (cashBalance) {
                                assert.notProperty(cashBalance, "error");
                                assert.strictEqual(abi.number(cashBalance), 10000);
                                augur.getCashBalance(augur.coinbase, function (balance) {
                                    augur.web.logout();
                                    done();
                                });
                            });
                        });
                    },
                    done
                );
            });
        });
    });
}

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
        var signed = "f9017b80648203e88080b9012e37663465363136643635353236353637303030"+
                     "3030303030303030303030303030303030303030303030303030303030303030"+
                     "3030303030303030303030303030303330353733303766346536313664363535"+
                     "3236353637303030303030303030303030303030303030303030303030303030"+
                     "3030303030303030303030303030303030303030303030353733333630343535"+
                     "3736";
        var serializedTx = tx.serialize().toString("hex");
        assert.strictEqual(serializedTx.slice(0, 324), signed);
        assert.strictEqual(serializedTx.length, 764)
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

describe("Contract methods", function () {

    describe("Call", function () {

        it("call getBranches using web.invoke", function (done) {
            this.timeout(tools.TIMEOUT);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            augur.web.login(secureLoginID, password, function (user) {
                if (user.error) {
                    augur.web.logout();
                    return done(new Error(tools.pp(user)));
                }
                assert.strictEqual(
                    user.address,
                    augur.web.account.address
                );

                // sync
                var branches = augur.web.invoke(augur.tx.Branches.getBranches);
                assert.isAbove(branches.length, 0);
                assert.isArray(branches);
                assert.strictEqual(
                    augur.rpc.applyReturns(
                        augur.tx.Branches.getBranches.returns,
                        branches[0]
                    ),
                    augur.constants.DEFAULT_BRANCH_ID
                );

                // async
                augur.web.invoke(augur.tx.Branches.getBranches, function (branches) {
                    assert.isAbove(branches.length, 0);
                    assert.isArray(branches);
                    assert.strictEqual(
                        augur.rpc.applyReturns(
                            augur.tx.Branches.getBranches.returns,
                            branches[0]
                        ),
                        augur.constants.DEFAULT_BRANCH_ID
                    );
                    augur.web.logout();
                    done();
                });
            });
        });

    });

    if (process.env.AUGURJS_INTEGRATION_TESTS) {

        describe("Send transaction", function () {

            it("sign and send transaction using account 1", function (done) {
                this.timeout(tools.TIMEOUT);
                var augur = tools.setup(require("../../src"), process.argv.slice(2));
                augur.web.login(secureLoginID, password, function (user) {
                    if (user.error) {
                        augur.web.logout();
                        return done(new Error(tools.pp(user)));
                    }
                    var tx = clone(augur.tx.Faucets.reputationFaucet);
                    tx.params = augur.constants.DEFAULT_BRANCH_ID;
                    augur.web.invoke(tx, function (txhash) {
                        if (txhash.error) {
                            augur.web.logout();
                            return done(txhash);
                        }
                        assert(txhash);
                        assert.isObject(augur.rpc.rawTxs[txhash].tx);
                        assert.isAbove(parseFloat(augur.rpc.rawTxs[txhash].cost), 0);
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
                this.timeout(tools.TIMEOUT*4);
                var augur = tools.setup(require("../../src"), process.argv.slice(2));
                augur.web.login(secureLoginID, password, function (user) {
                    if (user.error) {
                        augur.web.logout();
                        return done(new Error(tools.pp(user)));
                    }
                    assert.strictEqual(
                        user.address,
                        augur.web.account.address
                    );
                    augur.reputationFaucet({
                        branch: augur.constants.DEFAULT_BRANCH_ID,
                        onSent: function (r) {
                            // sent
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.strictEqual(r.callReturn, "1");
                            assert.isObject(augur.rpc.rawTxs[r.txHash].tx);
                            assert.isAbove(parseFloat(augur.rpc.rawTxs[r.txHash].cost), 0);
                            assert.strictEqual(augur.rpc.txs[r.txHash].status, "pending");
                        },
                        onSuccess: function (r) {
                            // success
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.property(r, "blockHash");
                            assert.property(r, "blockNumber");
                            assert.isAbove(parseInt(r.blockNumber), 0);
                            assert.strictEqual(r.callReturn, "1");
                            assert.strictEqual(r.from, user.address);
                            assert.strictEqual(r.to, augur.contracts.Faucets);
                            assert.strictEqual(Number(r.value), 0);
                            assert.isObject(augur.rpc.rawTxs[r.txHash].tx);
                            assert.isAbove(parseFloat(augur.rpc.rawTxs[r.txHash].cost), 0);
                            assert.strictEqual(augur.rpc.txs[r.txHash].status, "confirmed");
                            done();
                        },
                        onFailed: done
                    });
                });
            });

        });

        describe("Set transaction nonce", function () {

            it("duplicate transaction: invoke reputationFaucet twice", function (done) {
                this.timeout(tools.TIMEOUT*2);
                var augur = tools.setup(require("../../src"), process.argv.slice(2));
                augur.web.login(secureLoginID, password, function (user) {
                    if (user.error) {
                        augur.web.logout();
                        return done(new Error(tools.pp(user)));
                    }
                    assert.strictEqual(
                        user.address,
                        augur.web.account.address
                    );
                    var count = 0;
                    augur.reputationFaucet({
                        branch: augur.constants.DEFAULT_BRANCH_ID,
                        onSent: function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.strictEqual(r.callReturn, "1");
                        },
                        onSuccess: function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.property(r, "blockHash");
                            assert.property(r, "blockNumber");
                            assert.isAbove(parseInt(r.blockNumber), 0);
                            assert.strictEqual(r.from, user.address);
                            assert.strictEqual(r.to, augur.contracts.Faucets);
                            assert.strictEqual(Number(r.value), 0);
                            if (++count === 2) done();
                        },
                        onFailed: done
                    });
                    augur.reputationFaucet({
                        branch: augur.constants.DEFAULT_BRANCH_ID,
                        onSent: function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.strictEqual(r.callReturn, "1");
                        },
                        onSuccess: function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.property(r, "blockHash");
                            assert.property(r, "blockNumber");
                            assert.isAbove(parseInt(r.blockNumber), 0);
                            assert.strictEqual(r.from, user.address);
                            assert.strictEqual(r.to, augur.contracts.Faucets);
                            assert.strictEqual(Number(r.value), 0);
                            if (++count === 2) done();
                        },
                        onFailed: done
                    });
                });
            });
        });
    }
});
