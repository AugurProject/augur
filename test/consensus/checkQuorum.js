/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var augur = require("../../src");
var log = console.log;

augur = require("../../src/utilities").setup(augur, process.argv.slice(2));

var branch_id = augur.branches.dev;

// checkQuorum.se
describe("checkQuorum", function () {
    it("checkQuorum(" + branch_id + ")", function (done) {
        augur.checkQuorum(branch_id, function (r) {
            assert(r.txHash);
            assert.strictEqual(r.txHash.length, 66);
            assert(parseInt(r.callReturn) === 0 || parseInt(r.callReturn) === 1);
            done();
        });
    });
});

// createBranch.se
// p2pWagers.se
// transferShares.se
