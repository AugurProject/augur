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
var random = require("../random");
var augur = tools.setup(require("../../src"), process.argv.slice(2));

// generate random private key
var privateKey = crypto.randomBytes(32);
var address = keys.privateKeyToAddress(privateKey);

// generate random names and passwords
var name = utils.sha256(new Date().toString());
var password = utils.sha256(Math.random().toString(36).substring(4));

var secureLoginID;
var generatedKeystore;

var name2 = utils.sha256(new Date().toString()).slice(10) + "@" +
    utils.sha256(new Date().toString()).slice(10) + ".com";
var password2 = utils.sha256(Math.random().toString(36).substring(4)).slice(10);
var secureLoginID2;

var numMarkets = parseInt(augur.getNumMarketsBranch(constants.DEFAULT_BRANCH_ID), 10);
var markets = augur.getSomeMarketsInBranch(constants.DEFAULT_BRANCH_ID, numMarkets - 101, numMarkets - 1);
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

afterEach(function () { augur.web.logout(); });

describe("Register", function () {
    it("register account 1: " + name + " / " + password, function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.register(name, password, function (result) {
            checkAccount(augur, result, true);
            secureLoginID = result.secureLoginID;
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
});

describe("Import Account", function () {
	it("Import Account should login the account given name, password, and keystore", function (done) {
		this.timeout(tools.TIMEOUT);
		var augur = tools.setup(require("../../src"), process.argv.slice(2));
		augur.web.importAccount(name, password, generatedKeystore, function (user) {
				assert.notProperty(user, "error");
				assert.isTrue(Buffer.isBuffer(augur.web.account.privateKey));
				assert.isString(user.address);
				assert.isString(user.secureLoginID);
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
            done();
        });
    });
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

describe("Logout", function () {
    it("logout and unset the account object", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login(secureLoginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.strictEqual(user.secureLoginID, secureLoginID);
            for (var i = 0; i < 2; ++i) {
                augur.web.logout();
                assert.notProperty(augur.web.account, "secureLoginID");
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
		var augur = tools.setup(require("../../src"), process.argv.slice(2));
		augur.web.login(secureLoginID, password, function (user) {
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

describe("eth_call", function () {
    it("call getBranches using web.invoke", function (done) {
        this.timeout(tools.TIMEOUT);
        var augur = tools.setup(require("../../src"), process.argv.slice(2));
        augur.web.login(secureLoginID, password, function (user) {
            assert.notProperty(user, "error");
            assert.strictEqual(user.address, augur.web.account.address);

            // sync
            var tx = clone(augur.tx.Branches.getBranches);
            var branches = augur.web.invoke(tx);
            assert.notProperty(branches, "error");
            assert.isAbove(branches.length, 0);
            assert.isArray(branches);
            assert.strictEqual(
                abi.format_int256(branches[0]),
                abi.format_int256(augur.constants.DEFAULT_BRANCH_ID)
            );

            // async
            augur.web.invoke(tx, function (branches) {
                assert.notProperty(branches, "error");
                assert.isAbove(branches.length, 0);
                assert.isArray(branches);
                assert.strictEqual(
                    abi.format_int256(branches[0]),
                    abi.format_int256(augur.constants.DEFAULT_BRANCH_ID)
                );
                done();
            });
        });
    });
});

describe("Integration tests", function () {
    if (!process.env.AUGURJS_INTEGRATION_TESTS) return;

    describe("Fund new account", function () {
        it("Address funding sequence", function (done) {
            this.timeout(tools.TIMEOUT*2);
            var augur = tools.setup(tools.reset("../../src/index"), process.argv.slice(2));
            var sender = augur.from;
            augur.web.login(secureLoginID, password, function (account) {
                // console.log("login:", account);
                checkAccount(augur, account);
                var recipient = account.address;
                var initial_balance = abi.fix(augur.rpc.balance(recipient));
                // console.log("initial balance:", initial_balance.toFixed());
                augur.web.fundNewAccountFromAddress(sender, 1, recipient, augur.constants.DEFAULT_BRANCH_ID,
                    function (res) {
                        assert.notProperty(res, "error");
                    },
                    function (response) {
                        assert.notProperty(response, "error");
                        assert.strictEqual(response.callReturn, "1");
                        var final_balance = abi.fix(augur.rpc.balance(recipient));
                        // console.log("final balance:", final_balance.toFixed());
                        assert.isAbove(final_balance.toNumber(), 0);
                        assert.isAbove(final_balance.minus(initial_balance).toNumber(), 0);
                        augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, recipient, function (repBalance) {
                            assert.notProperty(repBalance, "error");
                            assert.strictEqual(abi.number(repBalance), 47);
                            augur.getCashBalance(recipient, function (cashBalance) {
                                assert.notProperty(cashBalance, "error");
                                assert.strictEqual(parseInt(cashBalance), 10000);
                                done();
                            });
                        });
                    },
                    done
                );
            });
        });
        it("Faucet funding sequence", function (done) {
            this.timeout(tools.TIMEOUT*2);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));

            // faucet only exists on network 2!
            if (augur.network_id !== "2") return done();

            augur.web.login(secureLoginID2, password2, function (account) {
                // console.log("login:", account);
                checkAccount(augur, account);
                var recipient = account.address;
                var initial_balance = abi.unfix(augur.rpc.balance(recipient));
                // console.log("initial balance:", initial_balance.toFixed());
                augur.web.fundNewAccountFromFaucet(recipient, augur.constants.DEFAULT_BRANCH_ID,
                    function (res) {
                        assert.notProperty(res, "error");
                    },
                    function (response) {
                        assert.notProperty(response, "error");
                        assert.strictEqual(response.callReturn, "1");
                        var final_balance = abi.unfix(augur.rpc.balance(recipient));
                        // console.log("final balance:", final_balance.toFixed());
                        assert.isAbove(final_balance.toNumber(), 0);
                        assert.isAbove(final_balance.minus(initial_balance).toNumber(), 0);
                        augur.getRepBalance(augur.constants.DEFAULT_BRANCH_ID, recipient, function (repBalance) {
                            assert.notProperty(repBalance, "error");
                            assert.strictEqual(abi.number(repBalance), 47);
                            augur.getCashBalance(recipient, function (cashBalance) {
                                assert.notProperty(cashBalance, "error");
                                assert.strictEqual(parseInt(cashBalance), 10000);
                                done();
                            });
                        });
                    },
                    done
                );
            });
        });
    });

    describe("Send transaction", function () {
        it("sign and send transaction using account 1", function (done) {
            this.timeout(tools.TIMEOUT);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            augur.web.login(secureLoginID, password, function (user) {
                assert.notProperty(user, "error");
                var tx = clone(augur.tx.Faucets.reputationFaucet);
                tx.params = augur.constants.DEFAULT_BRANCH_ID;
                augur.web.invoke(tx, function (txhash) {
                    assert.notProperty(txhash, "error");
                    assert(txhash);
                    assert.isObject(augur.rpc.rawTxs[txhash].tx);
                    assert.isAbove(parseFloat(augur.rpc.rawTxs[txhash].cost), 0);
                    augur.rpc.getTx(txhash, function (confirmTx) {
                        assert.notProperty(confirmTx, "error");
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
        it("detect logged in user and default to web.invoke", function (done) {
            this.timeout(tools.TIMEOUT);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            augur.web.login(secureLoginID, password, function (user) {
                assert.notProperty(user, "error");
                assert.strictEqual(user.address, augur.web.account.address);
                augur.reputationFaucet({
                    branch: augur.constants.DEFAULT_BRANCH_ID + "01",
                    onSent: function (r) {
                        // sent
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.isObject(augur.rpc.rawTxs[r.txHash].tx);
                        assert.isAbove(parseFloat(augur.rpc.rawTxs[r.txHash].cost), 0);
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
                        assert.strictEqual(augur.rpc.txs[r.txHash].status, "mined");
                        done();
                    },
                    onFailed: done
                });
            });
        });
    });
    describe("Concurrent transactions", function () {
        it("staggered", function (done) {
            this.timeout(tools.TIMEOUT*2);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            var connectParams = {
                http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
                ws: augur.rpc.wsUrl,
                ipc: null
            };
            augur.connect(connectParams, function (connection) {
                assert.deepEqual(connection, connectParams);
                augur.web.login(secureLoginID, password, function (user) {
                    assert.notProperty(user, "error");
                    assert.strictEqual(user.address, augur.web.account.address);
                    var count = 0;
                    var tx1 = clone(augur.tx.Faucets.reputationFaucet);
                    var tx2 = clone(augur.tx.Faucets.fundNewAccount);
                    tx1.params = [random.hash()];
                    tx2.params = [random.hash()];
                    var txCount = parseInt(augur.rpc.pendingTxCount(user.address), 16);
                    tx1.nonce = txCount;
                    tx2.nonce = txCount + 1;
                    augur.transact(tx1, function (r) {
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        augur.transact(tx2, function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                        }, function (r) {
                            ++count;
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.property(r, "blockHash");
                            assert.property(r, "blockNumber");
                            assert.strictEqual(r.callReturn, "1");
                            assert.isAbove(parseInt(r.blockNumber), 0);
                            assert.strictEqual(r.from, user.address);
                            assert.strictEqual(r.to, augur.contracts.Faucets);
                            assert.strictEqual(Number(r.value), 0);
                            if (count === 2) done();
                        }, function (err) {
                            done(new Error(JSON.stringify(err)));
                        });
                    }, function (r) {
                        ++count;
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.property(r, "blockHash");
                        assert.property(r, "blockNumber");
                        assert.strictEqual(r.callReturn, "1");
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.strictEqual(r.from, user.address);
                        assert.strictEqual(r.to, augur.contracts.Faucets);
                        assert.strictEqual(Number(r.value), 0);
                        if (count === 2) done();
                    }, function (err) {
                        done(new Error(JSON.stringify(err)));
                    });
                });
            });
        });
        it("simultaneous", function (done) {
            this.timeout(tools.TIMEOUT*2);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            var connectParams = {
                http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
                ws: augur.rpc.wsUrl,
                ipc: null
            };
            augur.connect(connectParams, function (connection) {
                assert.deepEqual(connection, connectParams);
                augur.web.login(secureLoginID, password, function (user) {
                    assert.notProperty(user, "error");
                    assert.strictEqual(user.address, augur.web.account.address);
                    var count = 0;
                    var tx1 = clone(augur.tx.Faucets.reputationFaucet);
                    var tx2 = clone(augur.tx.Faucets.fundNewAccount);
                    tx1.params = [random.hash()];
                    tx2.params = [random.hash()];
                    var txCount = parseInt(augur.rpc.pendingTxCount(user.address), 16);
                    tx1.nonce = txCount;
                    tx2.nonce = txCount + 1;
                    augur.transact(tx1, function (r) {
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                    }, function (r) {
                        ++count;
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.property(r, "blockHash");
                        assert.property(r, "blockNumber");
                        assert.strictEqual(r.callReturn, "1");
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.strictEqual(r.from, user.address);
                        assert.strictEqual(r.to, augur.contracts.Faucets);
                        assert.strictEqual(Number(r.value), 0);
                        if (count === 2) done();
                    }, function (err) {
                        done(new Error(JSON.stringify(err)));
                    });
                    augur.transact(tx2, function (r) {
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                    }, function (r) {
                        ++count;
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.property(r, "blockHash");
                        assert.property(r, "blockNumber");
                        assert.strictEqual(r.callReturn, "1");
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.strictEqual(r.from, user.address);
                        assert.strictEqual(r.to, augur.contracts.Faucets);
                        assert.strictEqual(Number(r.value), 0);
                        if (count === 2) done();
                    }, function (err) {
                        done(new Error(JSON.stringify(err)));
                    });
                });
            });
        });
        it("duplicate nonce", function (done) {
            this.timeout(tools.TIMEOUT*2);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            var connectParams = {
                http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
                ws: augur.rpc.wsUrl,
                ipc: null
            };
            augur.connect(connectParams, function (connection) {
                assert.deepEqual(connection, connectParams);
                augur.web.login(secureLoginID, password, function (user) {
                    assert.notProperty(user, "error");
                    assert.strictEqual(user.address, augur.web.account.address);
                    var count = 0;
                    var tx1 = clone(augur.tx.Faucets.reputationFaucet);
                    var tx2 = clone(augur.tx.Faucets.fundNewAccount);
                    tx1.params = [random.hash()];
                    tx2.params = [random.hash()];
                    var txCount = parseInt(augur.rpc.pendingTxCount(user.address), 16);
                    tx1.nonce = txCount;
                    tx2.nonce = txCount;
                    augur.transact(tx1, function (r) {
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                    }, function (r) {
                        ++count;
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.property(r, "blockHash");
                        assert.property(r, "blockNumber");
                        assert.strictEqual(r.callReturn, "1");
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.strictEqual(r.from, user.address);
                        assert.strictEqual(r.to, augur.contracts.Faucets);
                        assert.strictEqual(Number(r.value), 0);
                        if (count === 2) done();
                    }, function (err) {
                        done(new Error(JSON.stringify(err)));
                    });
                    augur.transact(tx2, function (r) {
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                    }, function (r) {
                        ++count;
                        assert.property(r, "txHash");
                        assert.property(r, "callReturn");
                        assert.property(r, "blockHash");
                        assert.property(r, "blockNumber");
                        assert.strictEqual(r.callReturn, "1");
                        assert.isAbove(parseInt(r.blockNumber), 0);
                        assert.strictEqual(r.from, user.address);
                        assert.strictEqual(r.to, augur.contracts.Faucets);
                        assert.strictEqual(Number(r.value), 0);
                        if (count === 2) done();
                    }, function (err) {
                        done(new Error(JSON.stringify(err)));
                    });
                });
            });
        });
        it("duplicate payload", function (done) {
            this.timeout(tools.TIMEOUT*2);
            var augur = tools.setup(require("../../src"), process.argv.slice(2));
            var connectParams = {
                http: augur.rpc.nodes.local || augur.rpc.nodes.hosted[0],
                ws: augur.rpc.wsUrl,
                ipc: null
            };
            augur.connect(connectParams, function (connection) {
                assert.deepEqual(connection, connectParams);
                augur.web.login(secureLoginID, password, function (user) {
                    assert.notProperty(user, "error");
                    assert.strictEqual(user.address, augur.web.account.address);
                    var count = 0;
                    var branch = random.hash();
                    augur.reputationFaucet({
                        branch: branch,
                        onSent: function (r) {
                            ++count;
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                        },
                        onSuccess: function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.property(r, "blockHash");
                            assert.property(r, "blockNumber");
                            assert.strictEqual(r.callReturn, "1");
                            assert.isAbove(parseInt(r.blockNumber), 0);
                            assert.strictEqual(r.from, user.address);
                            assert.strictEqual(r.to, augur.contracts.Faucets);
                            assert.strictEqual(Number(r.value), 0);
                            if (count === 2) done();
                        },
                        onFailed: function (err) {
                            if (++count === 2) {
                                assert.strictEqual(err.error, -32000);
                                assert.isAbove(err.message.indexOf("Known transaction"), -1);
                                return done();
                            }
                            done(new Error(JSON.stringify(err)));
                        }
                    });
                    augur.reputationFaucet({
                        branch: branch,
                        onSent: function (r) {
                            ++count;
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                        },
                        onSuccess: function (r) {
                            assert.property(r, "txHash");
                            assert.property(r, "callReturn");
                            assert.property(r, "blockHash");
                            assert.property(r, "blockNumber");
                            assert.strictEqual(r.callReturn, "1");
                            assert.isAbove(parseInt(r.blockNumber), 0);
                            assert.strictEqual(r.from, user.address);
                            assert.strictEqual(r.to, augur.contracts.Faucets);
                            assert.strictEqual(Number(r.value), 0);
                            if (count === 2) done();
                        },
                        onFailed: function (err) {
                            if (++count === 2) {
                                assert.strictEqual(err.error, -32000);
                                assert.isAbove(err.message.indexOf("Known transaction"), -1);
                                return done();
                            }
                            done(new Error(JSON.stringify(err)));
                        }
                    });
                });
            });
        });
    });
});
