#!/usr/bin/env node

"use strict";

var Augur = require("../augur");

Augur.connect();

var log = console.log;

Augur.dispatch({
    branchId: Augur.branches.dev,
    onSent: function (r) {
        log("dispatch sent:", r.callReturn);
    },
    onSuccess: function (r) {
        log("dispatch success:", r);
    },
    onFailed: function (r) {
        throw r.message;
    }
});
