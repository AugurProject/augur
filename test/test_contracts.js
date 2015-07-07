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
