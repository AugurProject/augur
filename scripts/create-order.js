#!/usr/bin/env node

"use strict";

var approveAugurEternalApprovalValue = require("./approve-augur-eternal-approval-value");
var Augur = require("../src");

var augur = new Augur();

var ethereumNode = { http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546" };
var augurNode = "ws://127.0.0.1:8546";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  approveAugurEternalApprovalValue(augur, augur.rpc.getCoinbase(), function (err) {
    if (err) return console.error(err);
    console.log("approve ok");
    var txObj = {
      tx: { value: "0x470de4df820000", gas: "0x5b8d80" },
      _type: 0,
      _attoshares: "0x9184e72a000",
      _displayPrice: "0x7d0",
      _market: "0x272a4c898e8c292de91467f6a5047bdbb687fdda",
      _outcome: 0,
      _betterOrderId: 0,
      _worseOrderId: 0,
      _tradeGroupId: 0,
      onSent: res => console.log("publicCreateOrder sent:", res.callReturn, res.hash),
      onSuccess: res => console.log("publicCreateOrder success:", res.callReturn, res.hash),
      onFailed: err => console.error("publicCreateOrder failed", err),
    };
    console.log("creating order", txObj);
    augur.api.CreateOrder.publicCreateOrder(txObj);
  });
});
