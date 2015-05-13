#!/usr/bin/env node
/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");

describe("Ethereum JSON-RPC", function () {
    describe("coinbase", function () {
        it("should be 42 characters long", function (done) {
            assert.equal(Augur.coinbase.length, 42);
            done();
        });
    });
    describe("net_version", function () {
        it("should be version 0", function (done) {
            assert.equal(Augur.rpc("net_version"), "0");
            done();
        });
    });
    describe("eth_protocolVersion", function () {
        it("should be version 60", function (done) {
            assert.equal(Augur.eth("protocolVersion"), "60");
            done();
        });
    });
    describe("eth_coinbase", function () {
        it("should match Augur.coinbase", function (done) {
            assert.equal(Augur.eth("coinbase"), Augur.coinbase);
            done();
        });
    });
    describe("web3_sha3", function () {
        var input = "boom!";
        var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
        it("'" + input + "' should hash to '" + digest + "'", function (done) {
            var input = "boom!";
            var digest = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
            assert.equal(Augur.web3("sha3", input), digest);
            assert.equal(Augur.hash(input), digest);
            assert.equal(Augur.sha3(input), digest);
            done();
        });
    });
    describe("db_putString", function () {
        it("should return true", function (done) {
            assert.equal(Augur.db("putString", ["augur_test_DB", "boomkey", "boom!"]), true);
            done();
        });
    });
    describe("db_getString", function () {
        it("should fetch 'boom!' using key 'boomkey'", function (done) {
            Augur.db("putString", ["augur_test_DB", "boomkey", "boom!"]);
            assert.equal(Augur.db("getString", ["augur_test_DB", "boomkey"]), "boom!");
            done();
        });
    });
    describe("shh_version", function () {
        it("should be version 2", function (done) {
            assert.equal(Augur.shh("version"), "2");
            done();
        });
    });
    describe("gasPrice", function () {
        it("should be 10 szabo", function (done) {
            assert.equal(Augur.gasPrice(), "0x9184e72a000");
            done();
        });
    });      
    describe("blockNumber", function () {
        it("should be a number greater than or equal to 200,000", function (done) {
            assert(parseFloat(Augur.blockNumber()) >= 200000);
            done();
        });
    });
    describe("balance", function () {
        it("should be a number greater than or equal to 0", function (done) {
            assert(parseInt(Augur.balance()) >= 0);
            assert.equal(Augur.balance(), Augur.getBalance());
            done();
        });
    });
    describe("txCount", function () {
        it("should be a number greater than or equal to 0", function (done) {
            assert(parseInt(Augur.txCount()) >= 0);
            assert.equal(Augur.txCount(), Augur.getTransactionCount());
            done();
        });
    });
    describe("peerCount", function () {
        it("should be a number greater than or equal to 0", function (done) {
            assert(parseInt(Augur.peerCount()) >= 0);
            done();
        });
    });
});
