/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");
var constants = require("./constants");

require('it-each')({ testPerIteration: true });

var LOCAL_NODE = true;
var REMOTE_NODE = false;
var REMOTE_TIMEOUT = 10000;

Augur.connect();

describe("Reading contracts", function () {
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
describe("Connection", function () {
    if (LOCAL_NODE) {
        it("should connect successfully to 'http://localhost:8545'", function () {
            assert(Augur.connect("http://localhost:8545"));
            assert(Augur.coinbase);
        });
        it("should connect successfully to 'http://localhost'", function () {
            assert(Augur.connect("http://localhost"));
            assert(Augur.coinbase);
        });
        it("should connect successfully to 'localhost:8545'", function () {
            assert(Augur.connect("localhost:8545"));
            assert(Augur.coinbase);
        });
        it("should connect successfully to 'localhost'", function () {
            assert(Augur.connect("localhost"));
            assert(Augur.coinbase);
        });
        it("should connect successfully to { host: 'localhost', port: 8545, protocol: 'http' }", function () {
            assert(Augur.connect({ host: 'localhost', port: 8545, protocol: 'http' }));
            assert(Augur.coinbase);
        });
        it("should connect successfully to { host: 'localhost', port: 8545 }", function () {
            assert(Augur.connect({ host: 'localhost', port: 8545 }));
            assert(Augur.coinbase);
        });
        it("should connect successfully to { host: 'localhost' }", function () {
            assert(Augur.connect({ host: 'localhost' }));
            assert(Augur.coinbase);
        });
        it("should connect successfully to { port: 8545 }", function () {
            assert(Augur.connect({ port: 8545 }));
            assert(Augur.coinbase);
        });
        it("should connect successfully to { host: 'localhost:8545' }", function () {
            assert(Augur.connect({ host: 'localhost:8545' }));
            assert(Augur.coinbase);
        });
        it("should connect successfully to '127.0.0.1:8545'", function () {
            assert(Augur.connect('127.0.0.1:8545'));
            assert(Augur.coinbase);
        });
        it("should connect successfully to '127.0.0.1'", function () {
            assert(Augur.connect('127.0.0.1'));
            assert(Augur.coinbase);
        });
        it("should connect successfully to 'http://127.0.0.1:8545'", function () {
            assert(Augur.connect('http://127.0.0.1:8545'));
            assert(Augur.coinbase);
        });
        it("should connect successfully to 'http://127.0.0.1'", function () {
            assert(Augur.connect('http://127.0.0.1'));
            assert(Augur.coinbase);
        });
    }
    it("should update the transaction object addresses if the contracts are changed", function () {
        var new_address = "0x01";
        Augur.contracts.branches = new_address;
        Augur.connect();
        assert.equal(Augur.contracts.branches, new_address);
        assert.equal(Augur.init_contracts.branches, new_address);
    });
    it("should switch to 1010101 (private chain) contract addresses", function () {
        assert(Augur.connect("http://localhost:8545", 1010101));
        assert(Augur.contracts.branches, Augur.privatechain_contracts.branches);
        assert(Augur.contracts.center, Augur.privatechain_contracts.center);
        assert(Augur.connect({ host: 'localhost', port: 8545, chain: 1010101 }));
        assert(Augur.contracts.branches, Augur.privatechain_contracts.branches);
        assert(Augur.contracts.center, Augur.privatechain_contracts.center);
    });
    it("should switch to Ethereum testnet contract addresses", function () {
        assert(Augur.connect());
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.center, Augur.testnet_contracts.center);
        assert(Augur.connect("http://localhost:8545"));
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.center, Augur.testnet_contracts.center);
        assert(Augur.connect({ host: 'localhost', port: 8545, chain: null }));
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.center, Augur.testnet_contracts.center);
        assert(Augur.connect({ host: '127.0.0.1' }));
        assert(Augur.contracts.branches, Augur.testnet_contracts.branches);
        assert(Augur.contracts.center, Augur.testnet_contracts.center);
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
        assert(Augur.connect());
        assert(Augur.coinbase);
        assert.equal(Augur.RPC.protocol, "http");
        assert.equal(Augur.RPC.host, "localhost");
        assert.equal(Augur.RPC.port, 8545);
    });
});
