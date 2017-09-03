/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var encodeTag = require("../../../../src/format/tag/encode-tag");
var formatLogMessage = require("../../../../src/format/log/format-log-message");

describe("formatLogMessage", function () {
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
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        _owner: "0x0000000000000000000000000000000000000001",
        _spender: "0x0000000000000000000000000000000000000002",
        value: "10"
      }));
    }
  });
  test({
    label: "Deposit",
    msg: {
      value: speedomatic.fix("100")
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        value: "100"
      }));
    }
  });
  test({
    label: "MakeOrder",
    msg: {
      outcome: speedomatic.hex("1")
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        outcome: 1
      }));
    }
  });
  test({
    label: "MakeOrder",
    msg: {
      outcome: speedomatic.hex("2")
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        outcome: 2
      }));
    }
  });
  test({
    label: "CancelOrder",
    msg: {
      outcome: speedomatic.hex("2"),
      cashRefund: speedomatic.fix("100.5034")
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        outcome: 2,
        cashRefund: "100.5034"
      }));
    }
  });
  test({
    label: "TakeOrder",
    msg: {
      owner: "0x1",
      outcome: "1",
      type: "2"
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        owner: "0x0000000000000000000000000000000000000001",
        outcome: 1,
        type: "sell"
      }));
    }
  });
  test({
    label: "CreateMarket",
    msg: {
      marketCreationFee: speedomatic.fix("1500"),
      eventBond: speedomatic.fix("1000"),
      topic: encodeTag("testing")
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        marketCreationFee: "1500",
        eventBond: "1000",
        topic: "testing"
      }));
    }
  });
  test({
    label: "Transfer",
    msg: {
      _from: "3",
      _to: "4",
      _value: speedomatic.fix("312"),
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        _from: "0x0000000000000000000000000000000000000003",
        _to: "0x0000000000000000000000000000000000000004",
        _value: "312",
      }));
    }
  });
  test({
    label: "Withdraw",
    msg: {
      to: "0x1",
      value: speedomatic.fix("153.25")
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        to: "0x0000000000000000000000000000000000000001",
        value: "153.25"
      }));
    }
  });
  test({
    label: "a label we dont recognize in this function",
    msg: {
      sender: "0x1",
      amount: speedomatic.fix("10"),
      price: speedomatic.fix("5"),
      type: "1"
    },
    assertions: function (msg) {
      assert.strictEqual(JSON.stringify(msg), JSON.stringify({
        sender: "0x0000000000000000000000000000000000000001",
        amount: "10",
        price: "5",
        type: "buy"
      }));
    }
  });
});
