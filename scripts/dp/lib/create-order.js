"use strict";

var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var speedomatic = require("speedomatic");
var printTransactionStatus = require("./print-transaction-status");
var debugOptions = require("../../debug-options");

function convertDecimalToFixedPoint(decimalValue, conversionFactor) {
  return new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).floor().toFixed();
}

function createOrder(augur, marketId, outcome, numOutcomes, maxPrice, minPrice, numTicks, orderType, order, auth, callback) {
  var normalizedPrice = augur.trading.normalizePrice({ price: order.price, maxPrice: maxPrice, minPrice: minPrice });
  if (debugOptions.cannedMarkets) {
    console.log("price:", order.price);
    console.log("normalizedPrice:", normalizedPrice);
  }
  var tickSize = (new BigNumber(maxPrice, 10).minus(new BigNumber(minPrice, 10))).dividedBy(new BigNumber(numTicks, 10)).toFixed();
  var bnOnChainShares = new BigNumber(convertDecimalToFixedPoint(order.shares, speedomatic.fix(tickSize, "string")), 10);
  var bnPrice = new BigNumber(convertDecimalToFixedPoint(normalizedPrice, numTicks), 10);
  var orderTypeCode, bnCost;
  if (orderType === "buy") {
    orderTypeCode = 0;
    bnCost = bnOnChainShares.times(bnPrice);
  } else {
    orderTypeCode = 1;
    if (debugOptions.cannedMarkets) {
      console.log("on chain shares:", bnOnChainShares.toFixed());
      console.log("numTicks:", numTicks);
      console.log("price:", bnPrice.toFixed());
    }
    bnCost = bnOnChainShares.times(new BigNumber(numTicks, 10).minus(bnPrice));
  }
  if (debugOptions.cannedMarkets) console.log(chalk.cyan.dim("cost:"), chalk.cyan(speedomatic.unfix(bnCost, "string")));
  augur.api.CreateOrder.publicCreateOrder({
    meta: auth,
    tx: { value: "0x" + bnCost.toString(16), gas: augur.constants.CREATE_ORDER_GAS },
    _type: orderTypeCode,
    _attoshares: "0x" + bnOnChainShares.toString(16),
    _displayPrice: "0x" + bnPrice.toString(16),
    _market: marketId,
    _outcome: outcome,
    _betterOrderId: 0,
    _worseOrderId: 0,
    _tradeGroupId: 0,
    onSent: function (res) {
      if (debugOptions.cannedMarkets) {
        console.log(chalk.green.dim("publicCreateOrder sent:"), chalk.green(res.hash), chalk.cyan.dim(JSON.stringify(order)));
      }
    },
    onSuccess: function (res) {
      if (debugOptions.cannedMarkets) {
        console.log(chalk.green.dim("publicCreateOrder success:"), chalk.green(res.callReturn), chalk.cyan.dim(JSON.stringify(order)));
        printTransactionStatus(augur.rpc, res.hash);
      }
      callback(null, res);
    },
    onFailed: function (err) {
      if (debugOptions.cannedMarkets) {
        console.error(chalk.red.bold("publicCreateOrder failed:"), err, chalk.red.dim(JSON.stringify(order)));
        if (err != null) printTransactionStatus(augur.rpc, err.hash);
      }
      callback(err);
    },
  });
}

module.exports = createOrder;
