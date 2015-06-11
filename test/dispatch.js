#!/usr/bin/env node

"use strict";

var Augur = require("../augur");

Augur.connect();

var log = console.log;

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
        log("dispatch failed:");
        log(r);
    }
});
