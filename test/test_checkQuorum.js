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

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);

var amount = "1";
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

function check_quorum() {
    Augur.checkQuorum(branch,
        function (r) {
            // sent
        },
        function (r) {
            // success
            if (r && r.callReturn && r.callReturn !== "1") {
                var this_period = Augur.getVotePeriod(branch);
                if (this_period < period) {
                    log("Vote period " + this_period + "...");
                    check_quorum();
                } else {
                    log("Reached vote period " + period);
                }
            } else {
                log("Check quorum: " + r.callReturn);
            }
        },
        function (r) {
            // failed
            log("Check quorum failed: " + JSON.stringify(r, null, 2));
        }
    );
}

log("Fast forwarding to vote period " + period);
check_quorum();
