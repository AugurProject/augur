#!/usr/bin/env node

"use strict";

var Augur = require("../augur");

Augur.connect();

var log = console.log;

var num_components = 2;
var num_iterations = 5;
var dispatches = 9 + num_components*(4 + num_iterations);

Augur.dispatch({
    branchId: Augur.branches.dev,
    onSent: function (r) {
        log("dispatch", r.callReturn);
    },
    onSuccess: function (r) {
        log("dispatch", r);
        log("    - step:   ", Augur.getStep(branch));
        log("    - substep:", Augur.getSubstep(branch));
    },
    onFailed: function (r) {
        log(r);
        throw("dispatch failed");
    }
});
