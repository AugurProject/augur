#!/usr/bin/env node

var Augur = require("../src/augur");
var utilities = require("../src/utilities");

Augur = utilities.setup(Augur, process.argv.slice(2));

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
var reporters = [
    "0xa563fdd0e8dd843b9484729579505e9612b72089",
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c"
];

for (var i = 0, len = reporters.length; i < len; ++i) {
    utilities.read_ballots(Augur, reporters[i], branch, period);
}
