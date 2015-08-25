/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var ethrpc = require("ethrpc");
var contracts = require("augur-contracts").testchain;
var log = console.log;

require('it-each')({ testPerIteration: true });

ethrpc.nodes = ["http://127.0.0.1:8545"];

describe("Read contracts", function () {

    var test = function (c) {
        var res = ethrpc.read(contracts[c]);
        assert.notProperty(res, "error");
        assert.notStrictEqual(res, "0x");
    };

    var contract_list = [];
    for (var c in contracts) {
        if (!contracts.hasOwnProperty(c)) continue;
        if (c !== "namereg") {
            contract_list.push(c);
        }
    }

    it.each(contract_list, "read contract: %s", ['element'], function (element, next) {
        test(element);
        next();
    });

});
