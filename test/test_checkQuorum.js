/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var Augur = require("../src");
var log = console.log;

Augur = require("../src/utilities").setup(Augur, process.argv.slice(2));

var branch_id = Augur.branches.dev;

// checkQuorum.se
describe("checkQuorum", function () {
    it("checkQuorum(" + branch_id + ")", function (done) {
        Augur.checkQuorum(branch_id, function (r) {
            assert(r.txHash);
            assert.equal(r.txHash.length, 66);
            assert(parseInt(r.callReturn) === 0 || parseInt(r.callReturn) === 1);
            done();
        });
    });
});

// createBranch.se
// p2pWagers.se
// transferShares.se
