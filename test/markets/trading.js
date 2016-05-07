/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var async = require("async");
var abi = require("augur-abi");
var chalk = require("chalk");
var utils = require("../../src/utilities");
var augurpath = "../../src/index";
var augur = require(augurpath);
var runner = require("../runner");

var DEBUG = true;

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, [{
            method: "makeTradeHash",
            parameters: ["fixed", "fixed", "hashArray"]
        }, {
            method: "getInitialTrade",
            parameters: ["hash"]
        }, {
            method: "checkHash",
            parameters: ["hash"]
        }, {
            method: "getID",
            parameters: ["hash"]
        }, {
            method: "get_trade",
            parameters: ["hash"]
        }, {
            method: "get_amount",
            parameters: ["hash"]
        }, {
            method: "get_price",
            parameters: ["hash"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "setInitialTrade",
            parameters: ["hash"]
        }, {
            method: "commitTrade",
            parameters: ["hash"]
        }, {
            method: "zeroHash",
            parameters: []
        }, {
            method: "saveTrade",
            parameters: ["hash", "int", "hash", "fixed", "fixed", "address", "int"]
        }, {
            method: "update_trade",
            parameters: ["hash", "fixed"]
        }, {
            method: "remove_trade",
            parameters: ["hash"]
        }, {
            method: "fill_trade",
            parameters: ["hash", "fixed"]
        }, {
            method: "cancel",
            parameters: ["hash"]
        }, {
            method: "buy",
            parameters: ["fixed", "fixed", "hash", "int"]
        }, {
            method: "sell",
            parameters: ["fixed", "fixed", "hash", "int"]
        }, {
            method: "short_sell",
            parameters: ["hash", "fixed"]
        }, {
            method: "trade",
            parameters: ["fixed", "fixed", "hashArray"]
        }, {
            method: "buyCompleteSets",
            parameters: ["hash", "fixed"]
        }, {
            method: "sellCompleteSets",
            parameters: ["hash", "fixed"]
        }]);
    });
});
