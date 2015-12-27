/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var contracts = require("augur-contracts");
var utils = require("../../src/utilities");
var constants = require("../../src/constants");
var augurpath = "../../src/index";
var augur = require(augurpath);

require('it-each')({ testPerIteration: true });

beforeEach(function () { augur = utils.reset(augurpath); });

describe("augur.connect", function () {

    var connectString = [
        undefined,
        "http://localhost:8545",
        "http://localhost",
        "localhost:8545",
        "localhost",
        "127.0.0.1:8545",
        "127.0.0.1",
        "http://127.0.0.1:8545",
        "http://127.0.0.1"
    ];
    var connectObj = [
        { host: "localhost", port: 8545, protocol: "http" },
        { host: "localhost", port: 8545 },
        { host: "localhost" },
        { port: 8545 },
        { host: "127.0.0.1" }
    ];

    if (!process.env.CONTINUOUS_INTEGRATION) {
        it.each(
            connectString,
            "[sync] connect to %s",
            ["element"],
            function (element, next) {
                this.timeout(constants.TIMEOUT);
                assert.isTrue(augur.connect(element));
                assert.isTrue(augur.connected());
                assert.isString(augur.coinbase);
                next();
            }
        );
        it.each(
            connectString,
            "[async] connect to %s",
            ["element"],
            function (element, next) {
                this.timeout(constants.TIMEOUT);
                augur.connect(element, null, function (connected) {
                    assert.isTrue(connected);
                    assert.isString(augur.coinbase);
                    next();
                });
            }
        );
        it.each(
            connectObj,
            "[sync] connect to {protocol: '%s', host: '%s', port: '%s'}",
            ["protocol", "host", "port"],
            function (element, next) {
                this.timeout(constants.TIMEOUT);
                assert.isTrue(augur.connect(element));
                assert.isTrue(augur.connected());
                assert.isString(augur.coinbase);
                next();
            }
        );
        it.each(
            connectObj,
            "[async] connect to {protocol: '%s', host: '%s', port: '%s'}",
            ["protocol", "host", "port"],
            function (element, next) {
                this.timeout(constants.TIMEOUT);
                augur.connect(element, null, function (connected) {
                    assert.isTrue(connected);
                    assert.isString(augur.coinbase);
                    next();
                });
            }
        );
    }

    if (!process.env.CONTINUOUS_INTEGRATION) {

        it("should update the transaction object addresses when contracts are changed", function () {
            this.timeout(constants.TIMEOUT);
            var new_address = "0x01";
            augur.contracts.branches = new_address;
            augur.connect();
            assert.strictEqual(augur.contracts.branches, new_address);
            var newer_address = "0x02";
            augur.contracts.branches = newer_address;
            augur.connect();
            assert.strictEqual(augur.contracts.branches, newer_address);
        });

        it("should switch to Ethereum testnet contract addresses", function (done) {
            this.timeout(constants.TIMEOUT);
            assert(augur.connect());
            assert(augur.contracts.branches, contracts["0"].branches);
            assert(augur.contracts.createMarket, contracts["0"].createMarket);
            assert(augur.connect("http://localhost:8545"));
            assert(augur.contracts.branches, contracts["0"].branches);
            assert(augur.contracts.createMarket, contracts["0"].createMarket);
            assert(augur.connect({ host: "localhost", port: 8545, chain: null }));
            assert(augur.contracts.branches, contracts["0"].branches);
            assert(augur.contracts.createMarket, contracts["0"].createMarket);
            assert(augur.connect({ host: "127.0.0.1" }));
            assert(augur.contracts.branches, contracts["0"].branches);
            assert(augur.contracts.createMarket, contracts["0"].createMarket);
            done();
        });

    }

    it("should connect successfully to 'http://www.poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("http://www.poc9.com:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'http://69.164.196.239:8545'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("http://69.164.196.239:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to '69.164.196.239:8545'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("69.164.196.239:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to '69.164.196.239'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("69.164.196.239"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'http://poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("http://poc9.com"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("poc9.com:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'www.poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("www.poc9.com:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'www.poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("www.poc9.com"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect("poc9.com"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully with no parameters and reset the RPC settings", function () {
        this.timeout(constants.TIMEOUT);
        assert(augur.connect());
        assert(augur.coinbase);
    });
    it("should be on network 0, 10101, or 7", function () {
        assert(augur.network_id === "0" ||
               augur.network_id === "1" ||
               augur.network_id === "10101" ||
               augur.network_id === "7");
    });

    if (!process.env.CONTINUOUS_INTEGRATION) {

        it("should be unlocked", function () {
            augur.connect("http://127.0.0.1:8545");
            if (augur.rpc.nodes.local) {
                assert.isTrue(augur.rpc.unlocked(augur.coinbase));
            }
        });

    }
});
