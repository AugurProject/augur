#!/usr/bin/env node

"use strict";

var Augur = require("../src");

var augur = new Augur();

var ethereumNode = { http: "http://127.0.0.1:8545", ws: "ws://127.0.0.1:8546" };
var augurNode = "ws://127.0.0.1:8546";

augur.connect({ ethereumNode, augurNode }, (err, connectionInfo) => {
  if (err) return console.error(err);
  augur.api.Cash.approve({
    _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Augur,
    _value: augur.constants.ETERNAL_APPROVAL_VALUE,
    onSent: res => console.log("approve sent"),
    onSuccess: (res) => {
      console.log("approve success");
      var txObj = {
        tx: { value: "0x470de4df820000" },
        _type: 0,
        _attoshares: "0x9184e72a000",
        _displayPrice: "0x7d0",
        _market: "0xa3cdfc0629d95ab7a7a2a348fccf770f77ce35e3",
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
    },
    onFailed: err => console.error("approve failed", err),
  });
});
