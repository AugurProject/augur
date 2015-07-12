/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../src/augur");
var constants = require("../src/constants");
var log = console.log;

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

require('it-each')({ testPerIteration: true });

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
