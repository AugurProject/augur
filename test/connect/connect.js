/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../../src");
var constants = require("../../src/constants");
var contracts = require("../../src/contracts");
var utils = require("../../src/utilities");
var log = console.log;

require('it-each')({ testPerIteration: true });

Augur = utils.setup(Augur, process.argv.slice(2));

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

describe("Augur.connect", function () {
    it.each(
        connectString,
        "should connect to %s",
        ["element"],
        function (element, next) {
            this.timeout(constants.TIMEOUT);
            var Augur = utils.reset("../../src/index");
            assert(Augur.connect(element));
            assert.isTrue(Augur.connected());
            assert(Augur.coinbase);
            next();
        }
    );
    it.each(
        connectObj,
        "should connect to { protocol: '%s', host: '%s', port: '%s' }",
        ["protocol", "host", "port"],
        function (element, next) {
            this.timeout(constants.TIMEOUT);
            var Augur = utils.reset("../../src/index");
            assert(Augur.connect(element));
            assert.isTrue(Augur.connected());
            assert(Augur.coinbase);
            next();
        }
    );
    it("should update the transaction object addresses when contracts are changed", function () {
        this.timeout(constants.TIMEOUT);
        var new_address = "0x01";
        var Augur = utils.reset("../../src/index");
        Augur.contracts.branches = new_address;
        Augur.connect();
        assert.strictEqual(Augur.contracts.branches, new_address);
        var newer_address = "0x02";
        Augur.contracts.branches = newer_address;
        Augur.connect();
        assert.strictEqual(Augur.contracts.branches, newer_address);
    });
    it("should switch to 7 (private chain) contract addresses", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("http://localhost:8545", 7));
        assert(Augur.contracts.branches, contracts.privatechain.branches);
        assert(Augur.contracts.center, contracts.privatechain.center);
        assert(Augur.connect({ host: "localhost", port: 8545, chain: 7 }));
        assert(Augur.contracts.branches, contracts.privatechain.branches);
        assert(Augur.contracts.center, contracts.privatechain.center);
    });
    it("should switch to Ethereum testnet contract addresses", function (done) {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect());
        assert(Augur.contracts.branches, contracts.testnet.branches);
        assert(Augur.contracts.createMarket, contracts.testnet.createMarket);
        assert(Augur.connect("http://localhost:8545"));
        assert(Augur.contracts.branches, contracts.testnet.branches);
        assert(Augur.contracts.createMarket, contracts.testnet.createMarket);
        assert(Augur.connect({ host: "localhost", port: 8545, chain: null }));
        assert(Augur.contracts.branches, contracts.testnet.branches);
        assert(Augur.contracts.createMarket, contracts.testnet.createMarket);
        assert(Augur.connect({ host: "127.0.0.1" }));
        assert(Augur.contracts.branches, contracts.testnet.branches);
        assert(Augur.contracts.createMarket, contracts.testnet.createMarket);
        done();
    });
    it("should connect successfully to 'http://www.poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("http://www.poc9.com:8545"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to 'http://69.164.196.239:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("http://69.164.196.239:8545"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to '69.164.196.239:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("69.164.196.239:8545"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to '69.164.196.239'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("69.164.196.239"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to 'http://poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("http://poc9.com"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to 'poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("poc9.com:8545"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to 'www.poc9.com:8545'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("www.poc9.com:8545"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to 'www.poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("www.poc9.com"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully to 'poc9.com'", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect("poc9.com"));
        assert.strictEqual(Augur.coinbase, Augur.demo);
    });
    it("should connect successfully with no parameters and reset the RPC settings", function () {
        this.timeout(constants.TIMEOUT);
        var Augur = utils.reset("../../src/index");
        assert(Augur.connect());
        assert(Augur.coinbase);
        assert.strictEqual(Augur.options.RPC, "http://127.0.0.1:8545");
    });
    it("should be on network 0, 10101, or 7", function () {
        assert(Augur.network_id === "0" ||
               Augur.network_id === "1" ||
               Augur.network_id === "10101" ||
               Augur.network_id === "7");
    });
});
