"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var encodeTag = require("../../../src/modules/abacus").encodeTag;
var formatLogMessage = require("../../../src/filters/format-log-message");

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
      value: abi.fix("10")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        _owner: "0x0000000000000000000000000000000000000001",
        _spender: "0x0000000000000000000000000000000000000002",
        value: "10"
      }));
    }
  });
  test({
    label: "collectedFees",
    msg: {
      cashFeesCollected: abi.fix("13.575"),
      newCashBalance: abi.fix("10000"),
      lastPeriodRepBalance: abi.fix("99"),
      repGain: abi.fix("10"),
      newRepBalance: abi.fix("109"),
      notReportingBond: abi.fix("100"),
      totalReportingRep: abi.fix("90"),
      period: abi.hex("15"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        cashFeesCollected: "13.575",
        newCashBalance: "10000",
        lastPeriodRepBalance: "99",
        repGain: "10",
        newRepBalance: "109",
        notReportingBond: "100",
        totalReportingRep: "90",
        period: 15,
      }));
    }
  });
  test({
    label: "deposit",
    msg: {
      value: abi.fix("100")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        value: "100"
      }));
    }
  });
  test({
    label: "fundedAccount",
    msg: {
      cashBalance: abi.fix("10000"),
      repBalance: abi.fix("47")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        cashBalance: "10000",
        repBalance: "47"
      }));
    }
  });
  test({
    label: "log_add_tx",
    msg: {
      outcome: abi.hex("1"),
      isShortAsk: "1"
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        outcome: 1,
        isShortAsk: true
      }));
    }
  });
  test({
    label: "log_add_tx",
    msg: {
      outcome: abi.hex("2"),
      isShortAsk: "0"
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        outcome: 2,
        isShortAsk: false
      }));
    }
  });
  test({
    label: "log_cancel",
    msg: {
      outcome: abi.hex("2"),
      cashRefund: abi.fix("100.5034")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        outcome: 2,
        cashRefund: "100.5034"
      }));
    }
  });
  test({
    label: "log_fill_tx",
    msg: {
      owner: "0x1",
      takerFee: abi.fix("0.03"),
      makerFee: abi.fix("0.01"),
      onChainPrice: abi.fix("0.5"),
      outcome: "1",
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        owner: "0x0000000000000000000000000000000000000001",
        takerFee: "0.03",
        makerFee: "0.01",
        onChainPrice: "0.5",
        outcome: 1,
        type: "sell",
        isShortSell: true
      }));
    }
  });
  test({
    label: "log_short_fill_tx",
    msg: {
      owner: "0x2",
      type: "0x1",
      takerFee: abi.fix("0.02"),
      makerFee: abi.fix("0.01"),
      onChainPrice: abi.fix("0.6"),
      outcome: "2",
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        owner: "0x0000000000000000000000000000000000000002",
        type: "buy",
        takerFee: "0.02",
        makerFee: "0.01",
        onChainPrice: "0.6",
        outcome: 2,
      }));
    }
  });
  test({
    label: "marketCreated",
    msg: {
      marketCreationFee: abi.fix("1500"),
      eventBond: abi.fix("1000"),
      topic: encodeTag("testing")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        marketCreationFee: "1500",
        eventBond: "1000",
        topic: "testing"
      }));
    }
  });
  test({
    label: "payout",
    msg: {
      cashPayout: abi.fix("2500"),
      cashBalance: abi.fix("12500"),
      shares: abi.fix("200"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        cashPayout: "2500",
        cashBalance: "12500",
        shares: "200",
      }));
    }
  });
  test({
    label: "penalizationCaughtUp",
    msg: {
      penalizedFrom: abi.hex("10"),
      penalizedUpTo: abi.hex("100"),
      repLost: abi.fix("78.39"),
      newRepBalance: abi.fix("221.71"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        penalizedFrom: 10,
        penalizedUpTo: 100,
        repLost: "-78.39",
        newRepBalance: "221.71",
      }));
    }
  });
  test({
    label: "penalize",
    msg: {
      oldrep: abi.fix("400"),
      repchange: abi.fix("20"),
      p: abi.fix("10"),
      penalizedUpTo: abi.hex("200"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        oldrep: "400",
        repchange: "20",
        p: "10",
        penalizedUpTo: 200,
      }));
    }
  });
  test({
    label: "sentCash",
    msg: {
      _from: "1",
      _to: "2",
      _value: abi.fix("125"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        _from: "0x0000000000000000000000000000000000000001",
        _to: "0x0000000000000000000000000000000000000002",
        _value: "125",
      }));
    }
  });
  test({
    label: "Transfer",
    msg: {
      _from: "3",
      _to: "4",
      _value: abi.fix("312"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        _from: "0x0000000000000000000000000000000000000003",
        _to: "0x0000000000000000000000000000000000000004",
        _value: "312",
      }));
    }
  });
  test({
    label: "slashedRep",
    msg: {
      reporter: "0x1",
      repSlashed: abi.fix("5"),
      slasherBalance: abi.fix("95"),
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        reporter: "0x0000000000000000000000000000000000000001",
        repSlashed: "5",
        slasherBalance: "95",
      }));
    }
  });
  test({
    label: "submittedReport",
    msg: {
      ethics: abi.fix("20")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        ethics: "20"
      }));
    }
  });
  test({
    label: "submittedReportHash",
    msg: {
      ethics: abi.fix("34")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        ethics: "34"
      }));
    }
  });
  test({
    label: "tradingFeeUpdated",
    msg: {
      tradingFee: abi.fix("0.03")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        tradingFee: "0.03"
      }));
    }
  });
  test({
    label: "withdraw",
    msg: {
      to: "0x1",
      value: abi.fix("153.25")
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        to: "0x0000000000000000000000000000000000000001",
        value: "153.25"
      }));
    }
  });
  test({
    label: "a label we dont recognize in this function",
    msg: {
      sender: "0x1",
      amount: abi.fix("10"),
      price: abi.fix("5"),
      type: "1"
    },
    assertions: function (msg) {
      assert.deepEqual(JSON.stringify(msg), JSON.stringify({
        sender: "0x0000000000000000000000000000000000000001",
        amount: "10",
        price: "5",
        type: "buy"
      }));
    }
  });
});
