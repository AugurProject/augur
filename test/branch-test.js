/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var augur = require("augur.js");
var constants = require("../app/libs/constants");
var flux = require("./mock");

augur.connect();

// test("BranchActions.loadBranches", function (t) {
//     flux.actions.branch.loadBranches();
//     t.end();
// });

// test("BranchActions.setCurrentBranch", function (t) {
//     var branchId = 1010101;
//     flux.actions.branch.setCurrentBranch(branchId);
//     t.end();
// });

// test("BranchActions.updateCurrentBranch", function (t) {
//     flux.actions.branch.updateCurrentBranch();
//     t.end();
// });

// test("BranchActions.checkQuorum", function (t) {
//     flux.actions.branch.checkQuorum();
//     t.end();
// });
