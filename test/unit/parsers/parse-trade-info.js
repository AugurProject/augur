/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var parseTradeInfo = require("../../../src/parsers/parse-trade-info");

describe("parsers/parse-trade-info", function () {
  var test = function (t) {
    it(JSON.stringify(t), function () {
      t.assertions(parsers.parseTradeInfo(t.trade));
    });
  };
  // trade: [ tradeID, tradeType, marketID, FullPercisionAmount, fullPrecisionPrice, owner, blockID, outcomeID ]
  test({
    trade: undefined,
    assertions: function (parsed) {
      assert.isNull(parsed);
    }
  });
  test({
    trade: [],
    assertions: function (parsed) {
      assert.isNull(parsed);
    }
  });
  test({
    trade: ["fail"],
    assertions: function (parsed) {
      assert.isNull(parsed);
    }
  });
  test({
    trade: ["0xa1", "0x1", "0xb1", "0000004500234500120000", "5002342211221110328", "0xc1", "101010", "1"],
    assertions: function (parsed) {
      assert.isNull(parsed);
    }
  });
  test({
    trade: ["0xa1", "0x1", "0xb1", "10004500234500120000", "00000000000000000000000", "0xc1", "101010", "1"],
    assertions: function (parsed) {
      assert.isNull(parsed);
    }
  });
  test({
    trade: ["0xa1", "0x1", "0xb1", "10004500234500120000", "5002342211221110328", "0xc1", "101010", "1"],
    assertions: function (parsed) {
      assert.deepEqual(parsed, {
        id: "0x00000000000000000000000000000000000000000000000000000000000000a1",
        type: "buy",
        market: "0xb1",
        amount: "10.0045",
        fullPrecisionAmount: "10.00450023450012",
        price: "5.0023",
        fullPrecisionPrice: "5.002342211221110328",
        owner: "0x00000000000000000000000000000000000000c1",
        block: 1052688,
        outcome: "1"
      });
    }
  });
  test({
    trade: ["0xabc1", "0x2", "0xa1", "802393203427423923123", "42375829238539345978345", "0xc1", "101010", "1"],
    assertions: function (parsed) {
      assert.deepEqual(parsed, {
        id: "0x000000000000000000000000000000000000000000000000000000000000abc1",
        type: "sell",
        market: "0xa1",
        amount: "802.3932",
        fullPrecisionAmount: "802.393203427423923123",
        price: "42375.8293",
        fullPrecisionPrice: "42375.829238539345978345",
        owner: "0x00000000000000000000000000000000000000c1",
        block: 1052688,
        outcome: "1"
      });
    }
  });
  test({
    trade: ["0xabc1", "0x2", "0xa1", "802393203427423923123", "0", "0xc1", "101010", "1"],
    assertions: function (parsed) {
      assert.isNull(parsed);
    }
  });
});
