/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var chalk = require("chalk");
var Augur = require("../src");
require('it-each')({ testPerIteration: true });

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

var log = console.log;
var TIMEOUT = 120000;
var minValue = 0;
var maxValue = 1;
var numOutcomes = 2;
var num_events = 4;

var branch = Augur.branches.dev;
var period = Augur.getVotePeriod(branch);
    
// closeMarket.se
describe("closeMarket.se", function () {
    describe("closeMarket(" + branch_id + ", " + market_id + ") [call] ", function () {
        it("complete call-send-confirm callback sequence", function (done) {
            this.timeout(TIMEOUT);
            Augur.tx.closeMarket.send = false;
            Augur.tx.closeMarket.returns = "number";
            Augur.closeMarket(branch_id, market_id, function (r) {
                log("closeMarket: " + r);
                done();
            });
            Augur.tx.closeMarket.send = true;
            Augur.tx.closeMarket.returns = undefined;
        });
    });
});
