/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var path = require("path");
var assert = require("chai").assert;
var contracts = require("augur-contracts");
var connector = require("../../src/connect");
connector.debug = true;

var TIMEOUT = 12000;
var HOSTED_NODE = "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec";

require('it-each')({ testPerIteration: true });

describe("urlstring", function () {

    var test = function (t) {
        it(JSON.stringify(t.object) + " -> " + t.string, function () {
            assert.strictEqual(connector.urlstring(t.object), t.string);
        });
    };

    test({
        object: {host: "localhost", port: 8545, protocol: "http"},
        string: "http://localhost:8545"
    });
    test({
        object: {host: "localhost", port: 8545},
        string: "http://localhost:8545"
    });
    test({
        object: {host: "localhost"},
        string: "http://localhost"
    });
    test({
        object: {port: 8545},
        string: "http://127.0.0.1:8545"
    });
    test({
        object: {host: "127.0.0.1"},
        string: "http://127.0.0.1"
    });
    test({
        object: {host: "eth1.augur.net"},
        string: "http://eth1.augur.net"
    });
    test({
        object: {host: "eth1.augur.net", protocol: "https"},
        string: "https://eth1.augur.net"
    });
    test({
        object: {host: "127.0.0.1", port: 8547, protocol: "https"},
        string: "https://127.0.0.1:8547"
    });
});

describe("has_value", function () {

    var test = function (t) {
        it(JSON.stringify(t.object) + " has value " + t.value + " -> " + t.expected, function () {
            assert.strictEqual(connector.has_value(t.object, t.value), t.expected);
        });
    };

    test({
        object: {"augur": 42},
        value: 42,
        expected: "augur"
    });
    test({
        object: {"augur": 42},
        value: "augur",
        expected: undefined
    });
    test({
        object: {"augur": 42},
        value: 41,
        expected: undefined
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: "thereum",
        expected: "whee"
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: 42,
        expected: "augur"
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: "42",
        expected: undefined
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: "whee",
        expected: undefined
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: -42,
        expected: undefined
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: undefined,
        expected: undefined
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: null,
        expected: undefined
    });
    test({
        object: {"augur": null, "whee": "thereum"},
        value: null,
        expected: "augur"
    });
    test({
        object: {"augur": 42, "whee": "thereum"},
        value: "0x42",
        expected: undefined
    });
    test({
        object: {},
        value: null,
        expected: undefined
    });
    test({
        object: {},
        value: undefined,
        expected: undefined
    });
    test({
        object: {},
        value: 0,
        expected: undefined
    });
});

describe("connect", function () {

    beforeEach(function () {
        delete require.cache[require.resolve("../../src/connect")];
        connector = require("../../src/connect");
    });

    describe("hosted nodes", function () {

        var test = function (url) {
            it(url, function () {
                assert.isTrue(connector.connect(this.test.title));
                assert.strictEqual(connector.coinbase, HOSTED_NODE);
            });
        };

        test("https://eth1.augur.net");
        test("https://eth3.augur.net");
        test("https://eth4.augur.net");
        test("https://eth5.augur.net");
    });

    if (!process.env.CONTINUOUS_INTEGRATION) {
        describe("local node", function () {
            var connectString = [
                undefined,
                "http://localhost:8545",
                "localhost:8545",
                "127.0.0.1:8545",
                "http://127.0.0.1:8545"
            ];
            var connectObj = [
                {host: "localhost", port: 8545, protocol: "http"},
                {host: "localhost", port: 8545},
                {port: 8545},
            ];
            it.each(
                connectString,
                "[sync] connect to %s",
                ["element"],
                function (element, next) {
                    this.timeout(TIMEOUT);
                    assert.isTrue(connector.connect(element));
                    assert.isTrue(connector.connected());
                    assert.isString(connector.coinbase);
                    next();
                }
            );
            it.each(
                connectString,
                "[async] connect to %s",
                ["element"],
                function (element, next) {
                    this.timeout(TIMEOUT);
                    connector.connect(element, null, function (connected) {
                        assert.isTrue(connected);
                        assert.isString(connector.coinbase);
                        next();
                    });
                }
            );
            it.each(
                connectObj,
                "[sync] connect to {protocol: '%s', host: '%s', port: '%s'}",
                ["protocol", "host", "port"],
                function (element, next) {
                    this.timeout(TIMEOUT);
                    assert.isTrue(connector.connect(element));
                    assert.isTrue(connector.connected());
                    assert.isString(connector.coinbase);
                    next();
                }
            );
            it.each(
                connectObj,
                "[async] connect to {protocol: '%s', host: '%s', port: '%s'}",
                ["protocol", "host", "port"],
                function (element, next) {
                    this.timeout(TIMEOUT);
                    connector.connect(element, null, function (connected) {
                        assert.isTrue(connected);
                        assert.isString(connector.coinbase);
                        next();
                    });
                }
            );
        });
        it("update the transaction object addresses when contracts are changed", function () {
            this.timeout(TIMEOUT);
            var new_address = "0x01";
            connector.contracts.branches = new_address;
            connector.connect();
            assert.strictEqual(connector.contracts.branches, new_address);
            var newer_address = "0x02";
            connector.contracts.branches = newer_address;
            connector.connect();
            assert.strictEqual(connector.contracts.branches, newer_address);
        });
        it("switch to Ethereum testnet contract addresses", function (done) {
            this.timeout(TIMEOUT);
            assert(connector.connect());
            assert(connector.contracts.branches, contracts["0"].branches);
            assert(connector.contracts.createMarket, contracts["0"].createMarket);
            assert(connector.connect("http://localhost:8545"));
            assert(connector.contracts.branches, contracts["0"].branches);
            assert(connector.contracts.createMarket, contracts["0"].createMarket);
            assert(connector.connect({ host: "localhost", port: 8545, chain: null }));
            assert(connector.contracts.branches, contracts["0"].branches);
            assert(connector.contracts.createMarket, contracts["0"].createMarket);
            assert(connector.connect({ host: "127.0.0.1" }));
            assert(connector.contracts.branches, contracts["0"].branches);
            assert(connector.contracts.createMarket, contracts["0"].createMarket);
            done();
        });
        it("unlocked", function () {
            connector.connect("http://127.0.0.1:8545");
            if (connector.rpc.nodes.local) {
                assert.isTrue(connector.rpc.unlocked(connector.coinbase));
            }
        });
    }

    it("should connect successfully with no parameters and reset the RPC settings", function () {
        this.timeout(TIMEOUT);
        assert(connector.connect());
        assert(connector.coinbase);
    });
    it("should be on network 0, 10101, or 7", function () {
        assert(connector.network_id === "0" ||
               connector.network_id === "1" ||
               connector.network_id === "10101" ||
               connector.network_id === "7");
    });
});
