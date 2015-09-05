/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var augur = require("../../src");
require('it-each')({ testPerIteration: true });

augur = require("../../src/utilities").setup(augur, process.argv.slice(2));

var log = console.log;
var TIMEOUT = 120000;
var minValue = 0;
var maxValue = 1;
var numOutcomes = 2;
var num_events = 4;

var branch = augur.branches.dev;
var period = augur.getVotePeriod(branch);
    
// closeMarket.se
describe("closeMarket.se", function () {
    describe("closeMarket(" + branch_id + ", " + market_id + ") [call] ", function () {
        it("complete call-send-confirm callback sequence", function (done) {
            this.timeout(TIMEOUT);
            augur.tx.closeMarket.send = false;
            augur.tx.closeMarket.returns = "number";
            augur.closeMarket(branch_id, market_id, function (r) {
                log("closeMarket: " + r);
                done();
            });
            augur.tx.closeMarket.send = true;
            augur.tx.closeMarket.returns = undefined;
        });
    });
});
