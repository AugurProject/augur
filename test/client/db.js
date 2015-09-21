/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../../src/constants");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var db = require("../../src/client/db");
var log = console.log;

describe("Database", function () {

    var account = {
        handle: "jack@tinybike.net",
        privateKey: "deadbeef",
        iv: "zombeef",
        nonce: 0
    };

    // Firebase read and write methods
    describe("Firebase", function () {

        it("save account", function (done) {
            db.put(account.handle, account, function (url) {
                assert.strictEqual(url, constants.FIREBASE_URL + db.encode(account.handle));
                done();
            });
        });

        it("retrieve account", function (done) {
            db.get(account.handle, function (retrieved_account) {
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
            db.leveldb.put(augur.rpc, account.handle, account, "accounts");
            done();
        });

        it("retrieve account", function (done) {
            db.leveldb.get(augur.rpc, account.handle, "accounts", function (retrieved_account) {
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
            db.leveldb.put(augur.rpc, market, comment, "comments");
            done();
        });

        if (!process.env.CONTINUOUS_INTEGRATION) {

            it("retrieve comment", function (done) {
                this.timeout(constants.TIMEOUT);
                db.leveldb.get(augur.rpc, market, "comments", function (retrieved_comment) {
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
