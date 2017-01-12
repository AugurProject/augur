#!/usr/bin/env node

"use strict";

var augur = require("../src");

augur.connect({
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
  ipc: process.env.GETH_IPC
}, function (connection) {
  console.log("connected:", connection);
  augur.createEvent({
    branchId: 1010101,
    description: "oh hi world",
    expDate: parseInt(new Date().getTime() / 995, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    resolution: "somewhere over the rainbow",
    onSent: function (res) {
      console.log("createEvent sent:", res);
    },
    onSuccess: function (res) {
      console.log("createEvent success:", res);
      var eventID = res.callReturn;
      augur.createMarket({
        branchId: 1010101,
        description: "oh hi world",
        takerFee: "0.02",
        tags: ["oh", "hi", "world"],
        makerFee: "0.01",
        extraInfo: "don't mind me, just screaming 'oh hi world' into the void",
        events: eventID,
        onSent: function (res) {
          console.log("createMarket sent:", res);
        },
        onSuccess: function (res) {
          console.log("createMarket success:", res);
        },
        onFailed: function (err) {
          console.error("createMarket failed:", err);
        }
      });
    },
    onFailed: function (err) {
      console.error("createEvent failed:", err);
    }
  });
});
