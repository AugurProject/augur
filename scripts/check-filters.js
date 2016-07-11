#!/usr/bin/env node

"use strict";

var augur = require("../src");

augur.connect({http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546"});

augur.filters.listen({
    // block: function (msg) {
    //     console.log("block filter:", JSON.stringify(msg, null, 2));
    // },
    // contracts: function (msg) {
    //     console.log("contracts filter:", JSON.stringify(msg, null, 2));
    // },
    price: function (msg) {
        console.log("price filter:", JSON.stringify(msg, null, 2));
    },
    fill_tx: function (msg) {
        console.log("fill_tx filter:", JSON.stringify(msg, null, 2));
    },
    add_tx: function (msg) {
        console.log("add_tx filter:", JSON.stringify(msg, null, 2));
    },
    cancel: function (msg) {
        console.log("cancel filter:", JSON.stringify(msg, null, 2));
    },
    thru: function (msg) {
        console.log("thru filter:", JSON.stringify(msg, null, 2));
    },
    penalize: function (msg) {
        console.log("penalize filter:", JSON.stringify(msg, null, 2));
    },
    marketCreated: function (msg) {
        console.log("marketCreated filter:", JSON.stringify(msg, null, 2));
    },
    tradingFeeUpdated: function (msg) {
        console.log("tradingFeeUpdated filter:", JSON.stringify(msg, null, 2));
    },
    approval: function (msg) {
        console.log("approval filter:", JSON.stringify(msg, null, 2));
    },
    transfer: function (msg) {
        console.log("transfer filter:", JSON.stringify(msg, null, 2));
    },
}, function (filters) {
    console.log("setup complete:", filters);
});
