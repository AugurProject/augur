(function () {
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = utils.setup(utils.reset(augurpath), process.argv.slice(2));
var db = require("../../src/client/db");
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
                assert.strictEqual(account.nonce, retrieved_account.nonce);
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
                assert.strictEqual(account.nonce, retrieved_account.nonce);
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
