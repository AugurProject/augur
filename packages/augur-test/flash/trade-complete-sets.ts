import chalk from "chalk";
import { bignum, unfix } from "speedomatic";
import BigNumber from "bignumber.js";
import { ContractAPI } from "../libs/ContractAPI";
import { DB } from "@augurproject/sdk/build/state/db/DB";

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

function publicSellCompleteSets(augur, contract, marketId, value, amount, auth, callback) {
  const payload = {
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
  const payload = {
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

async function getFirstMarket(dbController) {
  const marketCreatedDB = await dbController.getSyncableDatabase(dbController.getDatabaseName("MarketCreated"));
  const previousDocumentEntries = await marketCreatedDB.allDocs();
  return previousDocumentEntries[0];
}

async function tradeCompleteSets(contractAPI: ContractAPI, dbController, args) {
  if (args === "help" || args.opt.help) {
    help();
    return;
  }


  const universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  const completeSets = augur.contracts.addresses[augur.rpc.getNetworkID()].CompleteSets;
  const amount = args.opt.amount;
  const marketId = args.opt.marketId;
  console.log(chalk.cyan.dim("universe:"), chalk.green(universe));
  getFirstMarket(augur, universe, marketId, function (err, market) {
    if (err) {
      console.log(chalk.red(err));
      return callback(err);
    }
    const numTicks = market.numTicks;
    const totalAmount = new BigNumber(amount, 10).times(new BigNumber(numTicks, 10));
    const value = totalAmount.toNumber();
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
        getOpenInterest(augur, universe, function (err, openInterest) {
          if (err) {
            console.log(chalk.red(err));
            return callback(err);
          }
          const openInterestEther = bignum(openInterest);
          const endingOI = unfix(openInterestEther, "string");
          console.log(chalk.cyan.dim("Open Interest:"), chalk.green(endingOI));
          return callback(null);
        });
      });
    });
  });
}

module.exports = tradeCompleteSets;
