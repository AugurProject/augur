/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var contracts = require("../../src/contracts");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;
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

    it("should reload modules with new nodes in augur.rpc.nodes", function () {
        augur.options.nodes = nodes;
        augur.reload_modules(augur.options);
        assert(utils.array_equal(augur.rpc.nodes.slice(1), nodes));
    });

    augur.options.nodes = nodes;
    augur.reload_modules(augur.options);
    
    it.each(augur.rpc.nodes, "should synchronously post eth_coinbase RPC to %s", ["element"], function (element, next) {
        this.timeout(constants.TIMEOUT);
        assert.strictEqual(augur.rpc.postSync(element, command).length, 42);
        next();
    });

    it.each(augur.rpc.nodes, "should asynchronously post eth_coinbase RPC to %s", ["element"], function (element, next) {
        this.timeout(constants.TIMEOUT);
        augur.rpc.post(element, JSON.stringify(command), null, function (response) {
            assert.strictEqual(response.length, 42);
            next();
        });
    });

    it("should call back after first successful asynchronous responses", function (done) {
        this.timeout(constants.TIMEOUT);
        augur.rpc.json_rpc(command, function (response) {
            assert.strictEqual(response.length, 42);
            done();
        });
    }); 

    it("should return after first successful synchronous response", function (done) {
        assert.strictEqual(augur.rpc.json_rpc(command).length, 42);
        done();
    });

});
