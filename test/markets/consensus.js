/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var runner = require("../runner");

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, "ProportionCorrect", [{
            method: "proportionCorrect",
            parameters: ["hash", "hash", "int"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, "Consensus", [{
            method: "incrementPeriodAfterReporting",
            parameters: ["hash"]
        }, {
            method: "penalizeWrong",
            parameters: ["hash", "hash"]
        }]);
    });
});
