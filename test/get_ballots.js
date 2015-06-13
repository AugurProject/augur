#!/usr/bin/env node

Augur = require('augur.js');

Augur.connect();

function read_ballots(address, branch, period) {
    var ballot, num_events;
    console.log("Looking up ballots for", address);
    for (var i = 0; i < period; ++i) {
        ballot = Augur.getReporterBallot(branch, i, address);
        if (ballot.length && ballot[0] !== undefined) {
            num_events = Augur.getNumberEvents(branch, i);
            console.log("Period", i, "\t", Augur.fix(ballot.slice(0, num_events), "hex"));
        }
    }    
}

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var reporters = [
    "0xa563fdd0e8dd843b9484729579505e9612b72089",
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c"
];
for (var i = 0, len = reporters.length; i < len; ++i) {
    read_ballots(reporters[i], branch, period);
}
