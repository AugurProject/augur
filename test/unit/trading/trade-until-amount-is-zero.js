/* eslint-env mocha */

"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();
var constants = require("../../../src/constants");
var convertBigNumberToHexString = require("../../../src/utils/convert-big-number-to-hex-string");

var counter = 0;
var GAS_PRICE = convertBigNumberToHexString(new BigNumber(constants.DEFAULT_GASPRICE, 10));

describe("trading/trade-until-amount-is-zero", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var tradeUntilAmountIsZero = proxyquire("../../../src/trading/trade-until-amount-is-zero", {
        "./calculate-trade-gas": proxyquire("../../../src/trading/calculate-trade-gas.js", {
          "../rpc-interface": t.mock.rpcInterface,
        }),
        "./get-trade-amount-remaining": t.mock.getTradeAmountRemaining,
        "../rpc-interface": t.mock.rpcInterface,
        "../api": t.mock.api,
      });
      tradeUntilAmountIsZero(Object.assign({}, t.params, {
        onSuccess: function (res) {
          t.params.onSuccess(res);
          done();
        },
      }));
    });
  };
  test({
    description: "buy 10 outcome 2 @ 0.5, gas limit > minimum trade price",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x" + constants.MINIMUM_TRADE_GAS.times(100).toString(16) };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              assert.strictEqual(p.tx.gas, "0x" + constants.MINIMUM_TRADE_GAS.times(100).times(constants.TRADE_GAS_LOWER_BOUND_MULTIPLIER).toString(16));
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "hex") });
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 2 @ 0.5, intermediate gas limit",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x" + constants.MINIMUM_TRADE_GAS.times(2).toString(16) };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.strictEqual(p.tx.gas, "0x" + constants.MINIMUM_TRADE_GAS.times(2).times(constants.TRADE_GAS_UPPER_BOUND_MULTIPLIER).toString(16));
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "hex") });
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 2 @ 0.5, gas limit < minimum trade price",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x" + constants.MINIMUM_TRADE_GAS.dividedBy(10).toString(16) };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.strictEqual(p.tx.gas, "0x" + constants.MINIMUM_TRADE_GAS.toString(16));
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "hex") });
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 2 @ 0.5, null current block",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return null;
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "hex") });
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 2 @ 0.5, no estimated cost",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x12345678" };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "string") });
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 2 @ 0.5 (3 remaining)",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH_1");
      },
      onSuccess: function (res) {
        assert.isNull(res);
        assert.strictEqual(counter, 2);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        if (p.transactionHash === "TRANSACTION_HASH_1") {
          callback(null, new BigNumber("300000000000000", 10));
        } else {
          callback(null, new BigNumber(0));
        }
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x12345678" };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.oneOf(p._fxpAmount, ["0x38d7ea4c68000", "0x110d9316ec000"]);
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              if (p._fxpAmount === "0x38d7ea4c68000") {
                assert.strictEqual(counter, 0);
                counter++;
                p.onSent({ hash: "TRANSACTION_HASH_1" });
                p.onSuccess({ hash: "TRANSACTION_HASH_1", value: speedomatic.fix("4", "string") });
              } else {
                assert.strictEqual(counter, 1);
                counter++;
                p.onSent({ hash: "TRANSACTION_HASH_2" });
                p.onSuccess({ hash: "TRANSACTION_HASH_2", value: speedomatic.fix("1", "string") });
              }
            },
          },
        };
      },
    },
  });
  test({
    description: "sell 10 outcome 2 @ 0.5",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 1,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x12345678" };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 1);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "string") });
            },
          },
        };
      },
    },
  });
  test({
    description: "sell 10 outcome 2 @ 0.5, no estimated cost",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 1,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x12345678" };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 1);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "string") });
            },
          },
        };
      },
    },
  });
  test({
    description: "close position (take-only) 10 outcome 2 @ 0.5",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 1,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      sharesProvided: "0",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: true,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x12345678" };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 1);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "string") });
            },
            publicTrade: function () {
              assert.fail();
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 1 @ 0.5 providing 5 shares of outcome 0",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 1,
      _fxpAmount: "10",
      sharesProvided: "5",
      _price: "0.5",
      numTicks: "10000",
      minPrice: "0",
      maxPrice: "1",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, new BigNumber(0));
      },
      rpcInterface: {
        eth: {
          gasPrice: function (p, callback) {
            callback(null, GAS_PRICE);
          },
        },
        getCurrentBlock: function () {
          return { gasLimit: "0x" + constants.MINIMUM_TRADE_GAS.times(2).toString(16) };
        },
      },
      api: function () {
        return {
          Trade: {
            publicFillBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 1);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.strictEqual(p.tx.gas, "0x" + constants.MINIMUM_TRADE_GAS.times(2).times(constants.TRADE_GAS_UPPER_BOUND_MULTIPLIER).toString(16));
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH", value: speedomatic.fix("5", "hex") });
            },
          },
        };
      },
    },
  });
});
