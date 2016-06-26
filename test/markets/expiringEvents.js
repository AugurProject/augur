/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var runner = require("../runner");

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, [{
            method: "calculateReportingThreshold",
            parameters: ["hash", "hash", "int"]
        }, {
            method: "getEventCanReportOn",
            parameters: ["hash", "int", "address", "hash"]
        }, {
            method: "getEventIndex",
            parameters: ["int", "hash"]
        }, {
            method: "getEvents",
            parameters: ["hash", "int"]
        }, {
            method: "getNumberEvents",
            parameters: ["hash", "int"]
        }, {
            method: "getEvent",
            parameters: ["hash", "int", "int"]
        }, {
            method: "getTotalRepReported",
            parameters: ["hash", "int"]
        }, {
            method: "getReport",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "getReportHash",
            parameters: ["hash", "int", "address", "hash"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, [{
            method: "addEvent",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "setTotalRepReported",
            parameters: ["hash", "int", "fixed"]
        }]);
    });
});
