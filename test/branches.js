/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var web3 = require("web3");
var Augur = require("../src");
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var numeric = require("../src/numeric");
var log = console.log;

Augur = utilities.setup(Augur, process.argv.slice(2));
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

var branch_id = Augur.branches.dev;
var branch_number = "0";

var branches_full_abi = [
    {
        "name": "addMarket(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getBranch(int256)",
        "type": "function",
        "inputs": [{ "name": "branchNumber", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getBranches()",
        "type": "function",
        "inputs": [],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "getMarkets(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256[]" }]
    },
    {
        "name": "getMinTradingFee(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getNumBranches()",
        "type": "function",
        "inputs": [],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getNumMarkets(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getPeriodLength(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getStep(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getSubstep(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "getVotePeriod(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "incrementPeriod(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "incrementStep(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "incrementSubstep(int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "initializeBranch(int256,int256,int256,int256)",
        "type": "function",
        "inputs": [{ "name": "ID", "type": "int256" }, { "name": "currentVotePeriod", "type": "int256" }, { "name": "periodLength", "type": "int256" }, { "name": "minTradingFee", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "setStep(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "step", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    },
    {
        "name": "setSubstep(int256,int256)",
        "type": "function",
        "inputs": [{ "name": "branch", "type": "int256" }, { "name": "substep", "type": "int256" }],
        "outputs": [{ "name": "out", "type": "int256" }]
    }
];

// branches.se
describe("branches.se", function () {
    describe("getBranches", function () {
        var test = function (r) {
            assert.equal(r.constructor, Array);
            assert.equal(r.length, 1);
            assert.equal(r[0], branch_id);
        };
        it("sync", function () {
            test(Augur.getBranches());
        });
        it("async", function (done) {
            Augur.getBranches(function (r) {
                test(r); done();
            });
        });
    });
    describe("getMarkets(" + branch_id + ")", function () {
        var test = function (r) {
            assert.equal(r.constructor, Array);
            assert(r.length > 1);
        };
        it("sync", function () {
            test(Augur.getMarkets(branch_id));
        });
        it("async", function (done) {
            Augur.getMarkets(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getPeriodLength(" + branch_id + ") == '1800'", function () {
        var test = function (r) {
            assert.equal(r, "1800");
        };
        it("sync", function () {
            test(Augur.getPeriodLength(branch_id));
        });
        it("async", function (done) {
            Augur.getPeriodLength(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getVotePeriod(" + branch_id + ") >= -1", function () {
        var test = function (r) {
            assert(parseInt(r) >= -1);
        };
        it("sync", function () {
            test(Augur.getVotePeriod(branch_id));
        });
        it("async", function (done) {
            Augur.getVotePeriod(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getStep(" + branch_id + ") == 0", function () {
        var test = function (r) {
            assert.equal(parseInt(r), 0);
        };
        it("sync", function () {
            test(Augur.getStep(branch_id));
        });
        it("async", function (done) {
            Augur.getStep(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumMarkets(" + branch_id + ") >= 1", function () {
        var test = function (r) {
            assert(parseInt(r) >= 1);
        };
        it("sync", function () {
            test(Augur.getNumMarkets(branch_id));
        });
        it("async", function (done) {
            Augur.getNumMarkets(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getMinTradingFee(" + branch_id + ")", function () {
        var test = function (r) {
            assert(Number(r) >= 0.0);
            assert(Number(r) <= 1.0);
        };
        it("sync", function () {
            test(Augur.getMinTradingFee(branch_id));
        });
        it("async", function (done) {
            Augur.getMinTradingFee(branch_id, function (r) {
                test(r); done();
            });
        });
    });
    describe("getNumBranches()", function () {
        var test = function (r) {
            assert.equal(parseInt(r), 1);
        };
        it("sync", function () {
            test(Augur.getNumBranches());
        });
        it("async", function (done) {
            Augur.getNumBranches(function (r) {
                test(r); done();
            });
        });
    });
    describe("getBranch(" + branch_number + ")", function () {
        var test = function (r) {
            assert.equal(r, branch_id);
        };
        it("sync", function () {
            test(Augur.getBranch(branch_number));
        });
        it("async", function (done) {
            Augur.getBranch(branch_number, function (r) {
                test(r); done();
            });
        });
    });
});

describe("augur.js / web3 interoperability", function () {
    it("market IDs should be identical", function () {
        this.timeout(constants.timeout);
        var web3markets = web3.eth.contract(branches_full_abi)
                                  .at(Augur.contracts.branches)
                                  .getMarkets
                                  .call(branch_id);
        Augur.options.BigNumberOnly = true;
        Augur = utilities.setup(Augur, process.argv.slice(2), null, true);
        var markets = {
            augurjs: Augur.getMarkets(branch_id),
            web3: web3markets
        };
        for (var i = 0, len = markets.augurjs.length; i < len; ++i) {
            // log("augurjs:", chalk.green(markets.augurjs[i].toString(16)));
            // log("web3:   ", chalk.green(markets.web3[i].toString(16)) + "\n");
            assert(markets.augurjs[i].eq(markets.web3[i]));
            assert.equal(
                markets.augurjs[i].toString(16),
                markets.web3[i].toString(16)
            );
        }
    });
});
