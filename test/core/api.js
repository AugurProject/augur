/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var contracts = require("augur-contracts");
var runner = require("../runner");
var augur = require("../../src");
augur.tx = new contracts.Tx(process.env.ETHEREUM_NETWORK_ID || "2");
augur.bindContractAPI();

var invoke = function (send) {
    return (send) ? "eth_sendTransaction" : "eth_call";
};

describe("Auto-generated API", function () {
    async.forEachOfSeries(augur.tx, function (methods, contract, nextContract) {
        describe(contract, function () {
            var api, methodLists;
            methodLists = {eth_sendTransaction: [], eth_call: []};
            for (var method in methods) {
                if (!methods.hasOwnProperty(method)) continue;
                api = augur.tx[this.title][method];
                methodLists[invoke(api.send)].push({
                    method: method,
                    parameters: api.signature || []
                });
            }
            for (var send in methodLists) {
                if (!methodLists.hasOwnProperty(send)) continue;
                runner(send, this.title, methodLists[send]);
            }
            nextContract();
        });
    });
});
