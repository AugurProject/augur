/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var runner = require("../runner");

describe("Unit tests", function () {
    describe("eth_call", function () {
        runner(this.title, "ExpiringEvents", [{
            method: "calculateReportingThreshold",
            parameters: ["hash", "hash", "int"]
        }, {
            method: "getNumReportsActual",
            parameters: ["hash", "int", "address"]
        }, {
            method: "getNumReportsExpectedEvent",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "getNumReportsEvent",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "getNumEventsToReportOn",
            parameters: ["hash", "int"]
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
            method: "getReport",
            parameters: ["hash", "int", "hash"]
        }, {
            method: "getBeforeRep",
            parameters: ["hash", "int"]
        }, {
            method: "getAfterRep",
            parameters: ["hash", "int"]
        }, {
            method: "getReportHash",
            parameters: ["hash", "int", "address", "hash"]
        }]);
    });
    describe("eth_sendTransaction", function () {
        runner(this.title, "ExpiringEvents", [{
            method: "addEvent",
            parameters: ["hash", "int", "hash", "fixed"]
        }]);
    });
});
