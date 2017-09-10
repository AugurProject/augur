/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var formatLogMessage = require("../../../../src/format/log/format-log-message");

describe("format/log/format-log-message", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(formatLogMessage(t.label, t.msg));
    });
  };
  test({
    label: "Approval",
    msg: {
      _owner: "0x1",
      _spender: "0x2",
      value: speedomatic.fix("10")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        _owner: "0x0000000000000000000000000000000000000001",
        _spender: "0x0000000000000000000000000000000000000002",
        value: "10"
      });
    }
  });
  test({
    label: "Deposit",
    msg: {
      value: speedomatic.fix("100")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        value: "100"
      });
    }
  });
  test({
    label: "MakeOrder",
    msg: {
      outcome: speedomatic.hex("1")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        outcome: 1
      });
    }
  });
  test({
    label: "MakeOrder",
    msg: {
      outcome: speedomatic.hex("2")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        outcome: 2
      });
    }
  });
  test({
    label: "CancelOrder",
    msg: {
      outcome: speedomatic.hex("2"),
      cashRefund: speedomatic.fix("100.5034")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        outcome: 2,
        cashRefund: "100.5034"
      });
    }
  });
  test({
    label: "TakeOrder",
    msg: {
      owner: "0x1",
      outcome: "1",
      orderType: "1"
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        owner: "0x0000000000000000000000000000000000000001",
        outcome: 1,
        orderType: "sell"
      });
    }
  });
  test({
    label: "CreateMarket",
    msg: {
      branch: "0xb",
      market: "0xa",
      creator: "0xb0b",
      marketCreationFee: speedomatic.fix("1500"),
      extraInfo: JSON.stringify({
        marketType: "categorical",
        shortDescription: "Will this market be the One Market?",
        longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
        outcomeNames: ["Yes", "Strong Yes", "Emphatic Yes"],
        tags: ["Ancient evil", "Large flaming eyes"],
        creationTimestamp: 1234567890
      })
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        branch: "0x000000000000000000000000000000000000000b",
        market: "0x000000000000000000000000000000000000000a",
        creator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "1500",
        extraInfo: {
          marketType: "categorical",
          shortDescription: "Will this market be the One Market?",
          longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
          outcomeNames: ["Yes", "Strong Yes", "Emphatic Yes"],
          tags: ["Ancient evil", "Large flaming eyes"],
          creationTimestamp: 1234567890
        }
      });
    }
  });
  test({
    label: "Transfer",
    msg: {
      _from: "3",
      _to: "4",
      _value: speedomatic.fix("312")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        _from: "0x0000000000000000000000000000000000000003",
        _to: "0x0000000000000000000000000000000000000004",
        _value: "312"
      });
    }
  });
  test({
    label: "Withdraw",
    msg: {
      to: "0x1",
      value: speedomatic.fix("153.25")
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        to: "0x0000000000000000000000000000000000000001",
        value: "153.25"
      });
    }
  });
  test({
    label: "a label we dont recognize in this function",
    msg: {
      sender: "0x1",
      amount: speedomatic.fix("10"),
      price: speedomatic.fix("5"),
      orderType: "0"
    },
    assertions: function (msg) {
      assert.deepEqual(msg, {
        sender: "0x0000000000000000000000000000000000000001",
        amount: "10",
        price: "5",
        orderType: "buy"
      });
    }
  });
});
