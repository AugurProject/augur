#!/usr/bin/env node

"use strict";

var tools = require("../test/tools");
var augur = tools.setup(require("../src"), process.argv.slice(2));

augur.filters.listen({
    block: function (msg) {
        console.log("block filter:", msg);
    },
    contracts: function (msg) {
        console.log("contracts filter:", msg);
    },
    price: function (msg) {
        console.log("price filter:", msg);
    },
    fill_tx: function (msg) {
        console.log("fill_tx filter:", msg);
    },
    add_tx: function (msg) {
        console.log("add_tx filter:", msg);
    },
    cancel: function (msg) {
        console.log("cancel filter:", msg);
    }
}, function (filters) {
    console.log("setup complete:", filters);
});
