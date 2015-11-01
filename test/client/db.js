(function () {
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
var log = console.log;

describe("Database", function () {

    var account = {
        handle: "jack@tinybike.net",
        privateKey: "deadbeef",
        iv: "zombeef"
    };

    beforeEach(function () {
        augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
    });

    describe("On-contract", function () {

        var handle = new Date().toString();
        var account = {
            handle: abi.prefix_hex(utils.sha256(handle)),
            privateKey: "0xa24ee972cb18558423456ff2bc609baab0dd5a0a4f0c566efeb9bf2429251976",
            iv: "0x262ce8235b1a4155d87c9bb99d680ad3",
            salt: "0xb3bd4935d13290fa7674ff8e757e5c3d76bc5cc6a118b7ef34cb93df50471125",
            mac: "0xfa9c2a61b7b2ffcb6d29de02051916b04d2a76222b954dea960cde20c54c99be",
            id: "0x360f5d691b1245c2a8a582db1e7c5213"
        };

        it("save account", function (done) {
            this.timeout(augur.constants.TIMEOUT);
            augur.db.contract.put(handle, account, function (res) {
                if (res && res.error) return done(res);
                assert.strictEqual(res, "1");
                done();
            });
        });

        it("retrieve account", function (done) {

            // synchronous
            var stored = augur.db.contract.get(handle);
            if (stored && stored.error) return done(stored);
            assert.strictEqual(handle, stored.handle);
            assert.strictEqual(abi.hex(account.privateKey), abi.hex(stored.privateKey));
            assert.strictEqual(abi.hex(account.iv), abi.hex(stored.iv));
            assert.strictEqual(abi.hex(account.salt), abi.hex(stored.salt));
            assert.strictEqual(abi.hex(account.mac), abi.hex(stored.mac));
            assert.strictEqual(abi.hex(account.id), abi.hex(stored.id));

            // asynchronous
            augur.db.contract.get(handle, function (storedAccount) {
                if (storedAccount && storedAccount.error) return done(storedAccount);
                assert.strictEqual(handle, storedAccount.handle);
                assert.strictEqual(abi.hex(account.privateKey), abi.hex(storedAccount.privateKey));
                assert.strictEqual(abi.hex(account.iv), abi.hex(storedAccount.iv));
                assert.strictEqual(abi.hex(account.salt), abi.hex(storedAccount.salt));
                assert.strictEqual(abi.hex(account.mac), abi.hex(storedAccount.mac));
                assert.strictEqual(abi.hex(account.id), abi.hex(storedAccount.id));
                done();
            });
        });

    });

    if (!process.env.CONTINUOUS_INTEGRATION) {

        describe("IPFS", function () {

            describe("set/getHash", function () {

                var test = function (t) {
                    it(t.name + ": " + t.hash, function (done) {
                        this.timeout(augur.constants.TIMEOUT*2);
                        augur.db.ipfs.setHash({
                            name: t.name,
                            hash: t.hash,
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
                                assert.strictEqual(r.from, augur.coinbase);
                                assert.strictEqual(r.to, augur.contracts.ipfs);
                                assert.strictEqual(parseInt(r.value), 0);
                                assert.strictEqual(r.callReturn, "1");

                                // asynchronous
                                augur.db.ipfs.getHash(t.name, function (ipfsHash) {
                                    if (!ipfsHash) return done("no response");
                                    if (ipfsHash.error) return done(ipfsHash);
                                    assert.strictEqual(ipfsHash, t.hash);

                                    // synchronous
                                    var syncIpfsHash = augur.db.ipfs.getHash(t.name);
                                    if (!syncIpfsHash) return done("no response");
                                    if (syncIpfsHash.error) return done(syncIpfsHash);
                                    assert.strictEqual(syncIpfsHash, t.hash);

                                    done();
                                });
                            },
                            onFailed: done
                        });
                    });
                };

                test({
                    name: "7",
                    hash: "QmaUJ4XspR3XhQ4fsjmqHSkkTHYiTJigKZSPa8i4xgVuAt"
                });
                test({
                    name: "10101",
                    hash: "QmeWQshJxTpnvAq58A51KhBkEi6YGJDKRe7rssPFRnX2EX"
                });
                test({
                    name: "7",
                    hash: "Qmehkp3udWtoLzJvxNJMtCkPmSExSr7ibHy3fdwJg2Z1Ju"
                });
                test({
                    name: "10101",
                    hash: "QmQKmU43G12uAF8HfWL7e3gUgxFm1C8F7CzMVm8FiHdW2G"
                });

            });

            var test_cases = [{
                label: "oh-hi.py",
                data: "hello world",
                hash: "Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD"
            }, {
                label: "zero",
                data: "0",
                hash: "QmS6mcrMTFsZnT3wAptqEb8NpBPnv1H6WwZBMzEjT8SSDv"
            }, {
                label: "a to b",
                data: { "a": "b" },
                hash: "QmUi9xHYZA13QS7yHSFzaaeHzxF4MGEBSZfHfkz79rENAX"
            }, {
                label: "stringified a to b",
                data: JSON.stringify({ "a": "b" }),
                hash: "QmUi9xHYZA13QS7yHSFzaaeHzxF4MGEBSZfHfkz79rENAX"
            }, {
                label: account.handle,
                data: account,
                hash: "QmeaNZPGPupiHF8CrviZ2x2nvMBYGwDTmcGWGBh4K97Co1"
            }];

            describe("put", function () {
                var test = function (t) {
                    it(JSON.stringify(t.data) + " -> " + t.hash, function (done) {
                        this.timeout(augur.constants.TIMEOUT);
                        augur.db.ipfs.put(t.label, t.data, function (ipfsHash) {
                            if (!ipfsHash) return done("no response");
                            if (ipfsHash.error) return done(ipfsHash);
                            assert.strictEqual(ipfsHash, t.hash);
                            done();
                        });
                    });
                };
                for (var i = 0; i < test_cases.length; ++i) {
                    test(test_cases[i]);
                }
            });

            describe("get", function () {
                var test = function (t) {
                    it(t.label + " -> " + JSON.stringify(t.data), function (done) {
                        this.timeout(augur.constants.TIMEOUT);
                        augur.db.ipfs.get(t.label, function (data) {
                            if (data === null || data === undefined) {
                                return done("no response");
                            }
                            if (data.error) return done(data);
                            if (data.constructor === Object) {
                                assert.deepEqual(data, t.data);
                            } else {
                                assert.strictEqual(data, t.data);
                            }
                            done();
                        });
                    });
                };
                for (var i = 0; i < test_cases.length; ++i) {
                    test(test_cases[i]);
                }
            });

        });
    }

    // Firebase read and write methods
    describe("Firebase", function () {

        it("save account", function (done) {
            augur.db.firebase.put(account.handle, account, function (url) {
                assert.strictEqual(url, constants.FIREBASE_URL + augur.db.firebase.encode(account.handle));
                done();
            });
        });

        it("retrieve account", function (done) {
            augur.db.firebase.get(account.handle, function (retrieved_account) {
                assert.strictEqual(account.handle, retrieved_account.handle);
                assert.strictEqual(account.privateKey, retrieved_account.privateKey);
                assert.strictEqual(account.iv, retrieved_account.iv);
                done();
            });
        });

    });

    // Read and write methods for Ethereum's LevelDB (deprecated)
    describe("Ethereum LevelDB", function () {

        it("save account", function (done) {
            augur.db.leveldb.put(augur.rpc, account.handle, account, "accounts");
            done();
        });

        it("retrieve account", function (done) {
            augur.db.leveldb.get(augur.rpc, account.handle, "accounts", function (retrieved_account) {
                assert.strictEqual(account.handle, retrieved_account.handle);
                assert.strictEqual(account.privateKey, retrieved_account.privateKey);
                assert.strictEqual(account.iv, retrieved_account.iv);
                done();
            });
        });

        var market = "0x01";
        var comment = [{
            whisperId: "0x0101010",
            from: "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
            comment: "test comment",
            time: Math.floor((new Date()).getTime() / 1000)
        }];

        it("save comment", function (done) {
            this.timeout(constants.TIMEOUT);
            augur.db.leveldb.put(augur.rpc, market, comment, "comments");
            done();
        });

        if (!process.env.CONTINUOUS_INTEGRATION) {

            it("retrieve comment", function (done) {
                this.timeout(constants.TIMEOUT);
                augur.db.leveldb.get(augur.rpc, market, "comments", function (retrieved_comment) {
                    assert.isArray(retrieved_comment);
                    assert.strictEqual(retrieved_comment.length, 1);
                    assert.strictEqual(comment[0].whisperId, retrieved_comment[0].whisperId);
                    assert.strictEqual(comment[0].from, retrieved_comment[0].from);
                    assert.strictEqual(comment[0].comment, retrieved_comment[0].comment);
                    assert.strictEqual(comment[0].time, retrieved_comment[0].time);
                    done();
                });
            });

        }

    });
});

})();
