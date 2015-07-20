/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var constants = require("../src/constants");
var contracts = require("../src/contracts");
var utilities = require("../src/utilities");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

require('it-each')({ testPerIteration: true });

var nodes = [
    "http://localhost:8545",
    "http://69.164.196.239:8545",
    "http://poc9.com:8545",
    "http://45.33.59.27:8545"
];

describe("RPC multicast", function () {
    
    var rpc_counter = 0;

    var command = {
        id: ++rpc_counter,
        jsonrpc: "2.0",
        method: "eth_coinbase",
        params: []
    };

    it("should reload modules with new nodes in Augur.rpc.nodes", function () {
        Augur.options.nodes = nodes;
        Augur.reload_modules(Augur.options);
        assert(utilities.array_equal(Augur.rpc.nodes.slice(1), nodes));
    });

    Augur.options.nodes = nodes;
    Augur.reload_modules(Augur.options);
    
    it.each(Augur.rpc.nodes, "should synchronously post eth_coinbase RPC to %s", ["element"], function (element, next) {
        this.timeout(constants.timeout);
        assert.equal(Augur.rpc.postSync(element, command).length, 42);
        next();
    });

    it.each(Augur.rpc.nodes, "should asynchronously post eth_coinbase RPC to %s", ["element"], function (element, next) {
        this.timeout(constants.timeout);
        Augur.rpc.post(element, JSON.stringify(command), null, function (response) {
            assert.equal(response.length, 42);
            next();
        });
    });

    it("should call back after first successful asynchronous responses", function (done) {
        this.timeout(constants.timeout);
        Augur.rpc.json_rpc(command, function (response) {
            assert.equal(response.length, 42);
            done();
        });
    }); 

    it("should return after first successful synchronous response", function (done) {
        assert.equal(Augur.rpc.json_rpc(command).length, 42);
        done();
    });

});
