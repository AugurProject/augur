/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var rpc = require("ethrpc");
var contracts = require("augur-contracts")[rpc.version()];
var log = console.log;

require('it-each')({ testPerIteration: true });

describe("Read contracts", function () {

    var test = function (c) {
        rpc.reset();
        var res = rpc.read(contracts[c]);
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

    it.each(
        contract_list,
        "read contract: %s",
        ['element'],
        function (element, next) {
            test(element);
            next();
        }
    );

});
