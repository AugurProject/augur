/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var log = console.log;

describe("Ethereum JSON-RPC", function () {
    describe("coinbase", function () {
        it("should be 42 characters long", function () {
            assert.strictEqual(augur.coinbase.length, 42);
        });
    });
    describe("eth_protocolVersion", function () {
        it("should be >= version 60", function () {
            assert(parseInt(augur.eth("protocolVersion")) >= 59);
        });
    });
    describe("eth_coinbase", function () {
        it("should match augur.coinbase", function () {
            assert.strictEqual(augur.eth("coinbase"), augur.coinbase);
        });
    });
    describe("web3_sha3", function () {
        var input = "boom!";
        var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
        it("'" + input + "' should hash to '" + digest + "'", function () {
            var input = "boom!";
            var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
            assert.strictEqual(augur.web3("sha3", input), digest);
            assert.strictEqual(augur.sha3(input), digest);
        });
    });
    describe("db_putString", function () {
        it("should return true", function () {
            assert.strictEqual(augur.leveldb("putString", ["augur_test_DB", "boomkey", "boom!"]), true);
        });
    });
    describe("db_getString", function () {
        it("should fetch 'boom!' using key 'boomkey'", function () {
            augur.leveldb("putString", ["augur_test_DB", "boomkey", "boom!"]);
            assert.strictEqual(augur.leveldb("getString", ["augur_test_DB", "boomkey"]), "boom!");
        });
    });
    describe("gasPrice", function () {
        it("should be > 0", function () {
            assert(parseInt(augur.gasPrice()) >= 0);
        });
    });
    describe("blockNumber", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseFloat(augur.blockNumber()) >= 0);
        });
    });
    describe("balance", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseInt(augur.balance()) >= 0);
        });
    });
    describe("txCount", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseInt(augur.txCount()) >= 0);
        });
    });
    describe("peerCount", function () {
        it("should be a number greater than or equal to 0", function () {
            this.timeout(24000);
            assert(parseInt(augur.peerCount()) >= 0);
        });
    });
});
