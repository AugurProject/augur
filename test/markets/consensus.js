/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var runner = require("../runner");

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, [{
            method: "proportionCorrect",
            parameters: ["hash", "hash", "int"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "moveEventsToCurrentPeriod",
            parameters: ["hash", "int", "int"]
        }, {
            method: "incrementPeriodAfterReporting",
            parameters: ["hash"]
        }, {
            method: "penalizeNotEnoughReports",
            parameters: ["hash"]
        }, {
            method: "penalizeWrong",
            parameters: ["hash", "hash"]
        }, {
            method: "collectFees",
            parameters: ["hash"]
        }, {
            method: "penalizationCatchup",
            parameters: ["hash"]
        }, {
            method: "slashRep",
            parameters: ["hash", "int", "fixed", "address", "hash"]
        }]);
    });
});
