/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src");
var constants = require("../../src/constants");
var contracts = require("../../src/contracts");
var utils = require("../../src/utilities");
var log = console.log;

require('it-each')({ testPerIteration: true });

augur = utils.setup(augur, process.argv.slice(2));

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
    { host: "localhost:8545" }
];

describe("augur.connect", function () {
    it.each(
        connectString,
        "should connect to %s",
        ["element"],
        function (element, next) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.reset("../../src/index");
            assert(augur.connect(element));
            assert.isTrue(augur.connected());
            assert(augur.coinbase);
            next();
        }
    );
    it.each(
        connectObj,
        "should connect to { protocol: '%s', host: '%s', port: '%s' }",
        ["protocol", "host", "port"],
        function (element, next) {
            this.timeout(constants.TIMEOUT);
            var augur = utils.reset("../../src/index");
            assert(augur.connect(element));
            assert.isTrue(augur.connected());
            assert(augur.coinbase);
            next();
        }
    );
    it("should update the transaction object addresses when contracts are changed", function () {
        this.timeout(constants.TIMEOUT);
        var new_address = "0x01";
        var augur = utils.reset("../../src/index");
        augur.contracts.branches = new_address;
        augur.connect();
        assert.strictEqual(augur.contracts.branches, new_address);
        var newer_address = "0x02";
        augur.contracts.branches = newer_address;
        augur.connect();
        assert.strictEqual(augur.contracts.branches, newer_address);
    });
    it("should switch to 7 (private chain) contract addresses", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("http://localhost:8545", 7));
        assert(augur.contracts.branches, contracts.privatechain.branches);
        assert(augur.contracts.center, contracts.privatechain.center);
        assert(augur.connect({ host: "localhost", port: 8545, chain: 7 }));
        assert(augur.contracts.branches, contracts.privatechain.branches);
        assert(augur.contracts.center, contracts.privatechain.center);
    });
    it("should switch to Ethereum testnet contract addresses", function (done) {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect());
        assert(augur.contracts.branches, contracts.testnet.branches);
        assert(augur.contracts.createMarket, contracts.testnet.createMarket);
        assert(augur.connect("http://localhost:8545"));
        assert(augur.contracts.branches, contracts.testnet.branches);
        assert(augur.contracts.createMarket, contracts.testnet.createMarket);
        assert(augur.connect({ host: "localhost", port: 8545, chain: null }));
        assert(augur.contracts.branches, contracts.testnet.branches);
        assert(augur.contracts.createMarket, contracts.testnet.createMarket);
        assert(augur.connect({ host: "127.0.0.1" }));
        assert(augur.contracts.branches, contracts.testnet.branches);
        assert(augur.contracts.createMarket, contracts.testnet.createMarket);
        done();
    });
    it("should connect successfully to 'http://www.poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("http://www.poc9.com:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'http://69.164.196.239:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("http://69.164.196.239:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to '69.164.196.239:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("69.164.196.239:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to '69.164.196.239'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("69.164.196.239"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'http://poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("http://poc9.com"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("poc9.com:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'www.poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("www.poc9.com:8545"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'www.poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("www.poc9.com"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully to 'poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect("poc9.com"));
        assert.strictEqual(augur.coinbase, augur.demo);
    });
    it("should connect successfully with no parameters and reset the RPC settings", function () {
        this.timeout(constants.TIMEOUT);
        var augur = utils.reset("../../src/index");
        assert(augur.connect());
        assert(augur.coinbase);
        assert.strictEqual(augur.options.RPC, "http://127.0.0.1:8545");
    });
    it("should be on network 0, 10101, or 7", function () {
        assert(augur.network_id === "0" ||
               augur.network_id === "1" ||
               augur.network_id === "10101" ||
               augur.network_id === "7");
    });
    it("should be unlocked", function () {
        assert.isTrue(augur.unlocked());
    });
});
