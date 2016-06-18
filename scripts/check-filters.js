#!/usr/bin/env node

"use strict";

var augur = require("../src");

augur.connect({http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546"});

augur.filters.listen({
    // block: function (msg) {
    //     console.log("block filter:", msg);
    // },
    // contracts: function (msg) {
    //     console.log("contracts filter:", msg);
    // },
    price: function (msg) {
        console.log("price filter:", msg);
    },
    fill_tx: function (msg) {
        console.log("fill_tx filter:", msg);
    },
    // add_tx: function (msg) {
    //     console.log("add_tx filter:", msg);
    // },
    cancel: function (msg) {
        console.log("cancel filter:", msg);
    },
    thru: function (msg) {
        console.log("thru filter:", msg);
    },
    penalize: function (msg) {
        console.log("penalize filter:", msg);
    },
    marketCreated: function (msg) {
        console.log("marketCreated filter:", msg);
    },
    tradingFeeUpdated: function (msg) {
        console.log("tradingFeeUpdated filter:", msg);
    },
    approval: function (msg) {
        console.log("approval filter:", msg);
    },
    transfer: function (msg) {
        console.log("transfer filter:", msg);
    },
}, function (filters) {
    console.log("setup complete:", filters);
});
