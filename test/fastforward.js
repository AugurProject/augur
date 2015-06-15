/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("assert");
var Augur = require("../augur");

Augur.connect();

var log = console.log;
var TIMEOUT = 120000;

function check_quorum() {
    Augur.checkQuorum(branch,
        function (r) {
            // sent
        },
        function (r) {
            // success
            setTimeout(function () {
                if (r && r.callReturn && r.callReturn !== "1") {
                    var this_period = Augur.getVotePeriod(branch);
                    if (this_period < period) {
                        log("Vote period " + this_period + "...");
                        check_quorum();
                    } else {
                        log("Reached vote period " + period + "!");
                    }
                } else {
                    log("Check quorum: " + r.callReturn);
                }
            }, 2500);
        },
        function (r) {
            // failed
            throw("Check quorum failed");
        }
    );
}

var branch = Augur.branches.dev;
var events, period;
for (var i = 0; i < 200; ++i) {
    events = Augur.getEvents(branch, i);
    if (events && events.length && events.length > 1) {
        log("Found " + events.length + " events in vote period " + i);
        log(events);
        period = i;
        break;
    }
}

log("Fast forward to vote period " + period);
check_quorum();
