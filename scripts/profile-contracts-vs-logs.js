#!/usr/bin/env node

"use strict";

var async = require("async");
var rpc = require("ethrpc");

function getLogs(iterations, callback) {
  var startTime = Date.now();
  async.eachLimit(new Array(iterations), 5000, function (_, next) {
    rpc.getLogs({
      fromBlock: "0x7e6",
      toBlock: "0x7e6",
      // address: "0x52ccb0490bc81a2ae363fccbb2b367bca546cec7",
      // topics: ["0x94f1481ac3fc8e968bca7279f7811a02ae1212aa3a25e0f643684f5da1ef3ad6"]
    }, function (logs) {
      next();
    });
  }, function (err) {
    if (err) return console.error(err);
    var timeElapsed = Date.now() - startTime;
    console.log("Ran", iterations, "getLogs:", timeElapsed / 1000, "sec");
    if (callback) callback();
  });
}

function contractCalls(iterations, callback) {
  var params = [
    {
      "from": "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
      "to": "0x60cb05deb51f92ee25ce99f67181ecaeb0b743ea",
      "data": "0xd9cbe11b577552a2fc7f03ef13083a3e4f7ba93c547911c8a06971323b23cec1ed52bcb1",
      "gas": "0x2fd618"
    },
    "latest"
  ];
  var startTime = Date.now();
  async.eachLimit(new Array(iterations), 5000, function (_, next) {
    rpc.eth.call(params, function (res) {
      next();
    });
  }, function (err) {
    if (err) return console.error(err);
    var timeElapsed = Date.now() - startTime;
    console.log("Ran", iterations, "contract calls:", timeElapsed / 1000, "sec");
    if (callback) callback();
  });
}

function profile(iterations, callback) {
  getLogs(iterations, function () {
    contractCalls(iterations, callback);
  });
}

function warmUp(callback) {
  console.log("Warming up...");
  profile(10, callback);
}

rpc.connect({
  httpAddresses: ["http://localhost:8545"],
  wsAddresses: [], // ["ws://localhost:8546"],
  ipcAddresses: [], // ["/home/jack/.ethereum-10101/geth.ipc"],
  connectionTimeout: 10000
}, function () {
  warmUp(function () {
    profile(10000, process.exit);
  });
});
