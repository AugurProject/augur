/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");

Augur.connect();

var log = console.log;

describe("Ethereum JSON-RPC", function () {
    describe("coinbase", function () {
        it("should be 42 characters long", function () {
            assert.equal(Augur.coinbase.length, 42);
        });
    });
    describe("net_version", function () {
        it("should be version 0, 10101, or 1010101", function () {
            assert(Augur.rpc("net_version") === "0"
                || Augur.rpc("net_version") === "10101"
                || Augur.rpc("net_version") === "1010101");
        });
    });
    describe("eth_protocolVersion", function () {
        it("should be >= version 60", function () {
            assert(parseInt(Augur.eth("protocolVersion")) >= 60);
        });
    });
    describe("eth_coinbase", function () {
        it("should match Augur.coinbase", function () {
            assert.equal(Augur.eth("coinbase"), Augur.coinbase);
        });
    });
    describe("web3_sha3", function () {
        var input = "boom!";
        var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
        it("'" + input + "' should hash to '" + digest + "'", function () {
            var input = "boom!";
            var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
            assert.equal(Augur.web3("sha3", input), digest);
            assert.equal(Augur.hash(input), digest);
            assert.equal(Augur.sha3(input), digest);
        });
    });
    describe("db_putString", function () {
        it("should return true", function () {
            assert.equal(Augur.db("putString", ["augur_test_DB", "boomkey", "boom!"]), true);
        });
    });
    describe("db_getString", function () {
        it("should fetch 'boom!' using key 'boomkey'", function () {
            Augur.db("putString", ["augur_test_DB", "boomkey", "boom!"]);
            assert.equal(Augur.db("getString", ["augur_test_DB", "boomkey"]), "boom!");
        });
    });
    describe("shh_version", function () {
        it("should be version 2", function () {
            assert.equal(Augur.shh("version"), "2");
        });
    });
    describe("gasPrice", function () {
        it("should be 10 szabo", function () {
            assert.equal(Augur.gasPrice(), "0x9184e72a000");
        });
    });      
    describe("blockNumber", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseFloat(Augur.blockNumber()) >= 0);
        });
    });
    describe("balance", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseInt(Augur.balance()) >= 0);
            assert.equal(Augur.balance(), Augur.getBalance());
        });
    });
    describe("txCount", function () {
        it("should be a number greater than or equal to 0", function () {
            assert(parseInt(Augur.txCount()) >= 0);
            assert.equal(Augur.txCount(), Augur.getTransactionCount());
        });
    });
    describe("peerCount", function () {
        it("should be a number greater than or equal to 0", function () {
            this.timeout(12000);
            assert(parseInt(Augur.peerCount()) >= 0);
        });
    });
});
