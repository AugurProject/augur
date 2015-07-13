/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var constants = require("../src/constants");
var contracts = require("../src/contracts");
var utilities = require("../src/utilities");
var Augur = utilities.setup(require("../src"), process.argv.slice(2));
var log = console.log;

var nodes = [
    "http://69.164.196.239:8545",
    "http://45.33.59.27:8545"
];

describe("RPC multicast", function () {
    it("should reload modules with new nodes in Augur.options.nodes", function () {
        Augur.options.nodes = nodes;
        Augur.reload_modules(Augur.options);
        assert.equal(Augur.options.nodes, nodes);
    });
});
