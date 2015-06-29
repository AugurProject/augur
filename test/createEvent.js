#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var Augur = require('../augur');

var args = process.argv.slice(2);
if (args.length && args[0] === "--gospel") {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
Augur.connect();
log = console.log;

var NUM_EVENTS = 1;
var branch_id = "0x00000000000000000000000000000000000000000000000000000000000f69b5";
var event_description = Math.random().toString(36).substring(4);
var expDate = Augur.blockNumber() + 25;
var minValue = 0;
var maxValue = 1;
var numOutcomes = 2;

for (var i = 0; i < NUM_EVENTS; ++i) {
    Augur.createEvent({
        branchId: branch_id,
        description: event_description,
        expDate: expDate,
        minValue: minValue,
        maxValue: maxValue,
        numOutcomes: numOutcomes,
        onSent: function (r) {
            log("sent: " + JSON.stringify(r, null, 2));
        },
        onSuccess: function (r) {
            log("success: " + JSON.stringify(r, null, 2));
        },
        onFailed: function (r) {
            log("failed: " + JSON.stringify(r, null, 2));
        }
    });
}

// should fail
Augur.createEvent({
    branchId: branch_id,
    description: event_description,
    expDate: Augur.blockNumber() - 10,
    minValue: minValue,
    maxValue: maxValue,
    numOutcomes: numOutcomes,
    onSent: function (r) {
        log("sent: " + JSON.stringify(r, null, 2));
    },
    onSuccess: function (r) {
        log("success: " + JSON.stringify(r, null, 2));
    },
    onFailed: function (r) {
        log("failed: " + JSON.stringify(r, null, 2));
    }
});

Augur.createEvent({
    branchId: 1010101,
    description: "test",
    expDate: 23550,
    minValue: 0,
    maxValue: 1,
    numOutcomes: 2,
    onSent: function (r) {
        log("sent: " + JSON.stringify(r, null, 2));
    },
    onSuccess: function (r) {
        log("success: " + JSON.stringify(r, null, 2));
    },
    onFailed: function (r) {
        log("failed: " + JSON.stringify(r, null, 2));
    }
});
