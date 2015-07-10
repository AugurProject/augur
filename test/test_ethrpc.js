/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("./utilities").setup(require("../augur"), process.argv.slice(2));
var log = console.log;

describe("Ethereum JSON-RPC", function () {
    describe("coinbase", function () {
        it("should be 42 characters long", function () {
            assert.equal(Augur.coinbase.length, 42);
        });
    });
    describe("eth_protocolVersion", function () {
        it("should be >= version 60", function () {
            assert(parseInt(Augur.rpc.eth("protocolVersion")) >= 59);
        });
    });
    describe("eth_coinbase", function () {
        it("should match Augur.coinbase", function () {
            assert.equal(Augur.rpc.eth("coinbase"), Augur.coinbase);
        });
    });
    describe("web3_sha3", function () {
        var input = "boom!";
        var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
        it("'" + input + "' should hash to '" + digest + "'", function () {
            var input = "boom!";
            var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
            assert.equal(Augur.rpc.web3("sha3", input), digest);
            assert.equal(Augur.rpc.sha3(input), digest);
        });
    });
    describe("db_putString", function () {
        it("should return true", function () {
            assert.equal(Augur.rpc.db("putString", ["augur_test_DB", "boomkey", "boom!"]), true);
        });
    });
    describe("db_getString", function () {
        it("should fetch 'boom!' using key 'boomkey'", function () {
            Augur.rpc.db("putString", ["augur_test_DB", "boomkey", "boom!"]);
            assert.equal(Augur.rpc.db("getString", ["augur_test_DB", "boomkey"]), "boom!");
        });
    });
    describe("gasPrice", function () {
        it("should be > 0", function () {
            assert(parseInt(Augur.rpc.gasPrice()) >= 0);
        });
    });      
    describe("blockNumber", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseFloat(Augur.rpc.blockNumber()) >= 0);
        });
    });
    describe("balance", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseInt(Augur.rpc.balance()) >= 0);
        });
    });
    describe("txCount", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseInt(Augur.rpc.txCount()) >= 0);
        });
    });
    describe("peerCount", function () {
        it("should be a number greater than or equal to 0", function () {
            this.timeout(24000);
            assert(parseInt(Augur.rpc.peerCount()) >= 0);
        });
    });
});
