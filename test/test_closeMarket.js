/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var assert = require("assert");
var _ = require("lodash");
var chalk = require("chalk");
var Augur = require("../augur");
require('it-each')({ testPerIteration: true });
var path = require("path");
var args = process.argv.slice(2);
if (args.length && (args[0] === "--gospel" || args[0] === "--reset" || args[0] === "--postupload" || args[0] === "--faucets" || args[0] === "--ballots")) {
    var gospel = path.join(__dirname, "gospel.json");
    Augur.contracts = JSON.parse(fs.readFileSync(gospel));
}
Augur.connect();

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
