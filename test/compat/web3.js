/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var web3 = require("web3");
var utils = require("../../src/utilities");
var augur = utils.setup(require("../../src"), process.argv.slice(2));
var constants = augur.constants;

web3.setProvider(new web3.providers.HttpProvider(augur.rpc.nodes.local || augur.rpc.nodes.hosted[0]));

var branchId = augur.branches.dev;
var branchesAbi = [{
    "name": "addMarket(int256,int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }, {
        "name": "market",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getBranch(int256)",
    "type": "function",
    "inputs": [{
        "name": "branchNumber",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getBranches()",
    "type": "function",
    "inputs": [],
    "outputs": [{
        "name": "out",
        "type": "int256[]"
    }]
}, {
    "name": "getMarkets(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256[]"
    }]
}, {
    "name": "getMinTradingFee(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getNumBranches()",
    "type": "function",
    "inputs": [],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getNumMarkets(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getPeriodLength(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getStep(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getSubstep(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "getVotePeriod(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "incrementPeriod(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "incrementStep(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "incrementSubstep(int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "initializeBranch(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{
        "name": "ID",
        "type": "int256"
    }, {
        "name": "currentVotePeriod",
        "type": "int256"
    }, {
        "name": "periodLength",
        "type": "int256"
    }, {
        "name": "minTradingFee",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "setStep(int256,int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }, {
        "name": "step",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}, {
    "name": "setSubstep(int256,int256)",
    "type": "function",
    "inputs": [{
        "name": "branch",
        "type": "int256"
    }, {
        "name": "substep",
        "type": "int256"
    }],
    "outputs": [{
        "name": "out",
        "type": "int256"
    }]
}];

describe("augur.js / web3 interoperability", function () {
    describe("market IDs should be identical", function () {
        this.timeout(constants.TIMEOUT);
        var web3markets = web3.eth.contract(branchesAbi)
                                  .at(augur.contracts.branches)
                                  .getMarkets
                                  .call(new BigNumber(branchId));
        augur = utils.setup(augur, process.argv.slice(2));
        var markets = {
            augurjs: abi.hex(augur.getMarkets(branchId)),
            web3: abi.hex(web3markets)
        };
        var unforked;
        for (var i = 0, len = markets.augurjs.length; i < len; ++i) {
            it(markets.augurjs[i] + ", " + markets.web3[i], function () {
                assert.strictEqual(markets.augurjs[i], markets.web3[i]);
            });
            unforked = {
                augurjs: abi.unfork(markets.augurjs[i], true),
                web3: abi.unfork(markets.web3[i], true)
            };
            it(unforked.augurjs + ", " + unforked.web3, function () {
                assert.strictEqual(unforked.augurjs, unforked.web3);
            });
        }
    });
});
