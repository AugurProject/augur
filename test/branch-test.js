/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var valid = require("validator");
var constants = require("../app/libs/constants");
var flux = require("./mock");

flux.augur.connect();
var branchId = 1010101;

test("BranchActions.loadBranches", function (t) {
    t.plan(6);
    var LOAD_BRANCHES_SUCCESS = flux.register.LOAD_BRANCHES_SUCCESS;
    flux.register.LOAD_BRANCHES_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.branches.constructor, Array, "payload.branches is an array");
        t.true(payload.branches.length, "payload.branches.length >= 1");
        t.true(payload.branches.indexOf(flux.augur.branches.dev) > -1, "payload.branches includes " + flux.augur.branches.dev);
        LOAD_BRANCHES_SUCCESS(payload);
        t.pass("dispatch LOAD_BRANCHES_SUCCESS");
        t.deepEqual(payload.branches, flux.store("branch").getState().branches, "payload.branches == stored branches");
        flux.register.LOAD_BRANCHES_SUCCESS = LOAD_BRANCHES_SUCCESS;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.branch.loadBranches();
});

test("BranchActions.setCurrentBranch", function (t) {
    t.plan(6);
    var SET_CURRENT_BRANCH_SUCCESS = flux.register.SET_CURRENT_BRANCH_SUCCESS;
    flux.register.SET_CURRENT_BRANCH_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.id, branchId, "payload.id == input branchId");
        t.true(valid.isInt(payload.periodLength.toString()), "payload.periodLength is an integer");
        t.true(payload.periodLength > 0, "payload.periodLength > 0");
        SET_CURRENT_BRANCH_SUCCESS(payload);
        t.pass("dispatch SET_CURRENT_BRANCH_SUCCESS");
        t.deepEqual(payload, flux.store("branch").getCurrentBranch(), "payload == BranchStore.currentBranch");
        flux.register.SET_CURRENT_BRANCH_SUCCESS = SET_CURRENT_BRANCH_SUCCESS;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.branch.setCurrentBranch(branchId);
});

test("BranchActions.updateCurrentBranch", function (t) {
    t.plan(8);
    var UPDATE_CURRENT_BRANCH_SUCCESS = flux.register.UPDATE_CURRENT_BRANCH_SUCCESS;
    flux.register.UPDATE_CURRENT_BRANCH_SUCCESS = function (payload) {
        t.equal(payload.constructor, Object, "payload is an object");
        t.equal(payload.id, branchId, "payload.id == 1010101");
        t.true(valid.isInt(payload.periodLength.toString()), "payload.periodLength is an integer");
        t.true(payload.periodLength > 0, "payload.periodLength > 0");
        t.true(payload.currentPeriod >= 0, "payload.currentPeriod >= 0");
        t.true(payload.reportPeriod >= 0, "payload.reportPeriod >= 0");
        t.true(payload.percentComplete >= 0, "payload.percentComplete >= 0");
        t.true(payload.percentComplete <= 100, "payload.percentComplete <= 100");
        flux.register.UPDATE_CURRENT_BRANCH_SUCCESS = UPDATE_CURRENT_BRANCH_SUCCESS;
        if (!flux.augur.filters.price_filter.id) return t.end();
        flux.augur.filters.ignore(true, t.end);
    };
    flux.actions.branch.updateCurrentBranch();
});
