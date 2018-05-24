#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var BigNumber = require("bignumber.js");

function help() {
  console.log(chalk.red("Puts cash on the next fee window"));
  console.log(chalk.red("Shows balances on the next fee window"));
}

function getOpenInterest(augur, universe, callback) {
  augur.api.Universe.getOpenInterestInAttoEth({ tx: { to: universe } }, function (err, openInterest) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    return callback(null, openInterest);
  });
}

function showCashBalance(augur, address, callback) {
  augur.api.Cash.balanceOf({ _owner: address }, function (err, cashBalance) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var bnCashBalance = speedomatic.bignum(cashBalance);
    var totalCashBalance = speedomatic.unfix(bnCashBalance, "string");
    console.log(chalk.green.dim("Total Cash balance:"), chalk.green(totalCashBalance));
    callback(null);
  });
}

function publicSellCompleteSets(augur, contract, marketId, value, amount, auth, callback) {
  var payload = {
    meta: auth,
    tx: { to: contract,
      gas: "0x5e3918",
    },
    _amount: new BigNumber(amount).toString(16),
    _market: marketId,
    onSent: function () {
      console.log(chalk.yellow.dim("Waiting for reply SELL Complete Sets...."));
    },
    onSuccess: function (result) {
      console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
      callback(null, result);
    },
    onFailed: function (result) {
      console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
      callback(result, null);
    },
  };
  augur.api.CompleteSets.publicSellCompleteSets(payload);
}

function publicBuyCompleteSets(augur, contract, marketId, value, amount, auth, callback) {
  var payload = {
    meta: auth,
    tx: { to: contract,
      value: value,
      gas: "0x60E4B0",
    },
    _amount: new BigNumber(amount).toString(16),
    _market: marketId,
    onSent: function () {
      console.log(chalk.yellow.dim("Waiting for reply BUY Complete Sets...."));
    },
    onSuccess: function (result) {
      console.log(chalk.green.dim("Success:"), chalk.green(JSON.stringify(result)));
      callback(null, result);
    },
    onFailed: function (result) {
      console.log(chalk.red.dim("Failed:"), chalk.red(JSON.stringify(result)));
      callback(result, null);
    },
  };
  augur.api.CompleteSets.publicBuyCompleteSets(payload);
}

function getFirstMarket(augur, universe, marketId, callback) {
  augur.markets.getMarkets({ universe: universe, limit: 1 }, function (err, marketIds) {
    if (marketIds.length === 0) return callback("No markets found");
    var getMarketId = marketId || marketIds[0];
    augur.markets.getMarketsInfo({ marketIds: [getMarketId] }, function (err, marketsInfo) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      if (marketsInfo.length === 0) return callback("Market Info not found");
      return callback(null, marketsInfo[0]);
    });
  });
}

function tradeCompleteSets(augur, args, auth, callback) {
  if (args === "help" || args.opt.help) {
    help();
    return callback(null);
  }
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  var completeSets = augur.contracts.addresses[augur.rpc.getNetworkID()].CompleteSets;
  var amount = args.opt.amount;
  var marketId = args.opt.marketId;
  console.log(chalk.cyan.dim("universe:"), chalk.green(universe));
  getFirstMarket(augur, universe, marketId, function (err, market) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    var numTicks = market.numTicks;
    var totalAmount = new BigNumber(amount, 10).times(new BigNumber(numTicks, 10));
    var value = totalAmount.toNumber();
    console.log(chalk.cyan.dim("marketId:"), chalk.green(market.id));
    console.log(chalk.cyan.dim("amounts:"), chalk.green.dim(amount), chalk.green(totalAmount.toNumber()));
    publicBuyCompleteSets(augur, completeSets, market.id, value, amount, auth, function (err, result) {
      if (err) {
        console.log(chalk.red(err));
        return callback(err);
      }
      if (!result) return callback("Complete Sets Buy failed");
      publicSellCompleteSets(augur, completeSets, market.id, value, amount, auth, function (err, result) {
        if (err) {
          console.log(chalk.red(err));
          return callback(err);
        }
        if (!result) return callback("Complete Sets Sell failed");
        augur.api.Universe.getNextFeeWindow({ tx: { to: universe } }, function (err, nextFeeWindow) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          console.log(chalk.yellow.dim("Next Fee Window:"), chalk.yellow(nextFeeWindow));
          showCashBalance(augur, nextFeeWindow, function (err) {
            if (err) {
              console.log(chalk.red(err));
              return callback(err);
            }
            getOpenInterest(augur, universe, function (err, openInterest) {
              if (err) {
                console.log(chalk.red(err));
                return callback(err);
              }
              var openInterestEther = speedomatic.bignum(openInterest);
              var endingOI = speedomatic.unfix(openInterestEther, "string");
              console.log(chalk.cyan.dim("Open Interest:"), chalk.green(endingOI));
              return callback(null);
            });
          });
        });
      });
    });
  });
}

module.exports = tradeCompleteSets;
