/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../augur");
var constants = require("./constants");
var log = console.log;

Augur = require("./utilities").setup(Augur, process.argv.slice(2));

require('it-each')({ testPerIteration: true });

var LOCAL_NODE = true;
var REMOTE_NODE = false;
var LOCAL_TIMEOUT = 24000;
var REMOTE_TIMEOUT = 48000;

var connect_args = [
    null,
    "http://localhost:8545",
    "http://localhost",
    "localhost:8545",
    "localhost",
    { host: 'localhost', port: 8545, protocol: 'http' },
    { host: 'localhost', port: 8545 },
    { host: 'localhost' },
    { port: 8545 },
    { host: 'localhost:8545' },
    '127.0.0.1:8545',
    '127.0.0.1',
    'http://127.0.0.1:8545',
    'http://127.0.0.1'
];

describe("Read contracts", function () {
    var test = function (c) {
        assert(Augur.read(Augur.contracts[c]) !== "0x");
    };
    var contract_list = [];
    for (var c in Augur.contracts) {
        if (!Augur.contracts.hasOwnProperty(c)) continue;
        contract_list.push(c);
    }
    it.each(contract_list, "read contract: %s", ['element'], function (element, next) {
        test(element);
        next();
    });
});
describe("Augur.connect", function () {
    if (LOCAL_NODE) {
        it.each(connect_args, "should connect successfully to %s", ['element'], function (element, next) {
            this.timeout(LOCAL_TIMEOUT);
            assert(Augur.connect());
            assert(Augur.connected());
            assert(Augur.coinbase);
            next();
        });
    }
    it("should update the transaction object addresses if the contracts are changed", function () {
        this.timeout(LOCAL_TIMEOUT);
        var new_address = "0x01";
        Augur.contracts.branches = new_address;
        Augur.connect();
        assert.equal(Augur.contracts.branches, new_address);
        assert.equal(Augur.init_contracts.branches, new_address);
    });
    it("should switch to 1010101 (private chain) contract addresses", function () {
        this.timeout(LOCAL_TIMEOUT);
        assert(Augur.connect("http://localhost:8545", 1010101));
        assert(Augur.contracts.branches, Augur.privatechain_contracts.branches);
        assert(Augur.contracts.center, Augur.privatechain_contracts.center);
        assert(Augur.connect({ host: 'localhost', port: 8545, chain: 1010101 }));
        assert(Augur.contracts.branches, Augur.privatechain_contracts.branches);
        assert(Augur.contracts.center, Augur.privatechain_contracts.center);
    });
    it("should switch to Ethereum testnet contract addresses", function (done) {
        this.timeout(LOCAL_TIMEOUT);
        assert(Augur.connect());
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.createMarket, Augur.testnet_contracts.createMarket);
        assert(Augur.connect("http://localhost:8545"));
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.createMarket, Augur.testnet_contracts.createMarket);
        assert(Augur.connect({ host: 'localhost', port: 8545, chain: null }));
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.createMarket, Augur.testnet_contracts.createMarket);
        assert(Augur.connect({ host: '127.0.0.1' }));
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.createMarket, Augur.testnet_contracts.createMarket);
        done();
    });
    if (REMOTE_NODE) {
        it("should connect successfully to 'http://www.poc9.com:8545'", function () {
            this.timeout(REMOTE_TIMEOUT);
            assert(Augur.connect('http://www.poc9.com:8545'));
            assert.equal(Augur.coinbase, constants.accounts.loopy)
        });
        it("should connect successfully to 'http://poc9.com'", function () {
            this.timeout(REMOTE_TIMEOUT);
            assert(Augur.connect('http://poc9.com'));
            assert.equal(Augur.coinbase, constants.accounts.loopy)
        });
        it("should connect successfully to 'poc9.com:8545'", function () {
            this.timeout(REMOTE_TIMEOUT);
            assert(Augur.connect('poc9.com:8545'));
            assert.equal(Augur.coinbase, constants.accounts.loopy)
        });
        it("should connect successfully to 'www.poc9.com:8545'", function () {
            this.timeout(REMOTE_TIMEOUT);
            assert(Augur.connect('www.poc9.com:8545'));
            assert.equal(Augur.coinbase, constants.accounts.loopy)
        });
        it("should connect successfully to 'www.poc9.com'", function () {
            this.timeout(REMOTE_TIMEOUT);
            assert(Augur.connect('www.poc9.com'));
            assert.equal(Augur.coinbase, constants.accounts.loopy)
        });
        it("should connect successfully to 'poc9.com'", function () {
            this.timeout(REMOTE_TIMEOUT);
            assert(Augur.connect('poc9.com'));
            assert.equal(Augur.coinbase, constants.accounts.loopy)
        });
    }
    it("should connect successfully with no parameters and reset the RPC settings", function () {
        this.timeout(LOCAL_TIMEOUT);
        assert(Augur.connect());
        assert(Augur.coinbase);
        assert.equal(Augur.RPC.protocol, "http");
        assert(Augur.RPC.host === "localhost" || Augur.RPC.host === "127.0.0.1");
        assert.equal(Augur.RPC.port, 8545);
    });
    it("should be on network 0, 10101, or 1010101", function () {
        assert(Augur.network_id === "0" ||
               Augur.network_id === "10101" ||
               Augur.network_id === "1010101");
    });
});
