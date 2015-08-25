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
        handle: "tinybike",
        privateKey: "deadbeef",
        iv: "zombeef",
        nonce: 0
    };

    // Firebase read and write methods
    describe("Firebase", function () {

        it("save account", function (done) {
            db.put(account.handle, account, function (url) {
                assert.strictEqual(url, constants.FIREBASE_URL + "/" + account.handle);
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
            db.leveldb.put(augur.rpc, account.handle, account);
            done();
        });

        it("retrieve account", function (done) {
            db.leveldb.get(augur.rpc, account.handle, function (retrieved_account) {
                assert.strictEqual(account.handle, retrieved_account.handle);
                assert.strictEqual(account.privateKey, retrieved_account.privateKey);
                assert.strictEqual(account.iv, retrieved_account.iv);
                assert.strictEqual(account.nonce, retrieved_account.nonce);
                done();
            });
        });

    });
});
