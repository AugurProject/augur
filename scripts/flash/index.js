#!/usr/bin/env node

var Augur = require("../../src");
var debugOptions = require("../debug-options");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var getPrivateKeyFromEnv = require("../dp/lib/get-private-key").getPrivateKeyFromEnv;
var chalk = require("chalk");
var columnify = require("columnify");
var options = require("options-parser");

var NetworkConfiguration = require("augur-core").NetworkConfiguration;
var getBalance = require("./get-balance");
var getMarketBalance = require("./get-market-balance");
var listMarkets  = require("./list-markets");
var designatedReport = require("./designated-report");
var initialReport = require("./initial-report");
var disputeContribute = require("./dispute-contribute");
var finalizeMarket = require("./finalize-market");
var pushTime = require("./push-time");
var marketInfo = require("./market-info");
var showInitialReporter = require("./show-initial-reporter");
var fork = require("./fork");
var approval = require("./approve-account");
var listMarketOrders = require("./list-market-orders");
var fillMarketOrders = require("./fill-market-orders");
var createMarketOrder = require("./create-market-order");
var pushTimestamp = require("./push-timestamp");
var setTimestamp = require("./set-timestamp-cmd");
var forceDispute = require("./force-dispute");
var forceFinalize = require("./force-finalize");
var escapeHatch = require("./escape-hatch");
var transferAssets = require("./transfer-assets");
var tradeCompleteSets = require("./trade-complete-sets");

var NETWORKS = ["aura", "clique", "environment", "rinkeby", "ropsten"];
var methods = {
  "trade-complete-sets": {
    method: tradeCompleteSets,
    opts: {
      help: {flag: true, short: "h", help: "This help, transfer ETH or REP" },
      marketId: { short: "m", help: "Optional, will just grab one if not provided" },
      amount: { required: true, short: "a", help: "amount of asset to transfer" },
    },
  },
  "transfer-assets": {
    method: transferAssets,
    opts: {
      help: {flag: true, short: "h", help: "This help, transfer ETH or REP" },
      ether: { flag: true, short: "e", help: "indicates ETH" },
      rep: { flag: true, short: "r", help: "indicates REP" },
      to: { required: true, short: "t", help: "account address sending assets to" },
      amount: { required: true, short: "a", help: "amount of asset to transfer" },
    },
  },
  "get-balance": {
    method: getBalance,
    opts: {
      help: {flag: true, short: "h", help: "This help, get this accounts balances" },
      account: { required: true, short: "a", help: "account address" },
    },
  },
  "get-market-balance": {
    method: getMarketBalance,
    opts: {
      help: {flag: true, short: "h", help: "This help, get this accounts balances" },
      marketId: { required: true, short: "m", help: "Required market id" },
      account: { short: "a", help: "account address" },
    },
  },
  "list-markets": {
    method: listMarkets,
    opts: {
      help: {flag: true, short: "h", help: "This help, list all markets, show endTime and description" },
    },
  },
  "designate-report": {
    method: designatedReport,
    opts: {
      help: {flag: true, short: "h", help: "This help, REP is given to user if needed" },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: { required: true, short: "o", help: "Outcome, sets outcome to use, can be overridden by invalid flag, negative outcome use \\\"-10\\\"" },
      invalid: { flag: true, short: "i", help: "Overrides outcome to pass invalid" },
      noPush: { short: "n", flag: true, default: false, help: "normally time is used, no pushing" },
    },
  },
  "initial-report": {
    method: initialReport,
    opts: {
      help: {flag: true, short: "h", help: "This help, used for Open Reporting" },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: { required: true, short: "o", help: "Outcome, sets outcome to use, can be overridden by invalid flag, negative outcome use \\\"-10\\\"" },
      invalid: { flag: true, short: "i", help: "Overrides outcome to pass invalid" },
      noPush: { short: "n", flag: true, default: false, help: "normally time is used, no pushing" },
    },
  },
  "dispute-contribute": {
    method: disputeContribute,
    opts: {
      help: {flag: true, short: "h", help: "This help, push time and dispute this market" },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: { required: true, short: "o", help: "Outcome, sets outcome to use, can be overridden by invalid flag, negative outcome use \\\"-10\\\"" },
      amount: { short: "a", help: "Optional: amount of REP to dispute with" },
      invalid: { flag: true, short: "i", help: "Overrides outcome to pass invalid" },
      noPush: { short: "n", flag: true, default: false, help: "normally time is pushed to dispute contribute on market, simply don't push time" },
    },
  },
  "finalize-market": {
    method: finalizeMarket,
    opts: {
      help: {flag: true, short: "h", help: "This help, finalize the market, it's in the correct state" },
      marketId: { required: true, short: "m", help: "Required market id" },
      noPush: { short: "n", flag: true, default: false, help: "normally time is pushed to finalize market, to finalize forking market don't push time" },
    },
  },
  "push-time": {
    method: pushTime,
    opts: {
      help: {flag: true, short: "h", help: "This help, push-time has been dep. use push-timestamp or set-timestamp" },
    },
  },
  "market-info": {
    method: marketInfo,
    opts: {
      help: {flag: true, short: "h", help: "This help, show attributes of this market" },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "show-initial-reporter": {
    method: showInitialReporter,
    opts: {
      help: {flag: true, short: "h", help: "This help, show initial reporter address" },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "fork": {
    method: fork,
    opts: {
      help: {flag: true, short: "h", help: "This help, dispute this market all the way to fork" },
      marketId: { required: true, short: "m", help: "Required market id" },
      stopsBefore: { short: "s", help: "Number of rounds to stop short of a fork"},
    },
  },
  "approval": {
    method: approval,
    opts: {
      help: {flag: true, short: "h", help: "This help" },
      account: { required: true, short: "a", help: "account address to be approved to trade" },
    },
  },
  "list-market-orders": {
    method: listMarketOrders,
    opts: {
      help: {flag: true, short: "h", help: "This help" },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "fill-market-orders": {
    method: fillMarketOrders,
    opts: {
      help: {flag: true, short: "h", help: "This help, script approves user if needed" },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: { required: true, short: "o", help: "Outcome to fill order on, negative outcome use \\\"-10\\\"" },
      orderType: {required: true, short: "t", help: "Order type ('buy' | 'sell')"},
    },
  },
  "create-market-order": {
    method: createMarketOrder,
    opts: {
      help: {flag: true, short: "h", help: "This help, script approves user if needed" },
      marketId: { required: true, short: "m", help: "Required market id" },
      outcome: { required: true, short: "o", help: "Outcome to fill order on, negative outcome use \\\"-10\\\"" },
      orderType: {required: true, short: "t", help: "Order type ('buy' | 'sell')"},
      price: {required: true, short: "p", help: "Price of the order"},
      amount: {required: true, short: "a", help: "amount of shares to purchase with eth"},
      useShares: {flag: true, short: "s", help: "use existing shares for the order"},
    },
  },
  "push-timestamp": {
    method: pushTimestamp,
    opts: {
      help: {flag: true, short: "h", help: "This help" },
      days: { flag: true, short: "d", help: "push days" },
      weeks: { flag: true, short: "w", help: "push weeks" },
      seconds: { flag: true, short: "s", help: "push seconds, default" },
      count: { required: true, short: "c", help: "Required number of unit to push timestamp" },
    },
  },
  "set-timestamp": {
    method: setTimestamp,
    opts: {
      help: {flag: true, short: "h", help: "This help" },
      timestamp: { required: true, short: "t", help: "Required actual timestamp to set" },
    },
  },
  "force-dispute": {
    method: forceDispute,
    opts: {
      help: {flag: true, short: "h", help: "This help" },
      marketId: { required: true, short: "m", help: "Required market id" },
      rounds: { default: 10, short: "r", help: "Number or rounds to dispute, default is 10" },
    },
  },
  "force-finalize": {
    method: forceFinalize,
    opts: {
      help: {flag: true, short: "h", help: "This help" },
      marketId: { required: true, short: "m", help: "Required market id" },
    },
  },
  "escape-hatch": {
    method: escapeHatch,
    opts: {
      help: {flag: true, short: "h", help: "This help, turn the escape hatch on" },
    },
  },
};

function runCommandWithArgs(commandName, method, args, network, callback) {
  console.log("Running with Args");
  console.log(chalk.yellow.dim("command"), commandName);
  console.log(chalk.yellow.dim("parameters"), JSON.stringify(args));
  console.log(chalk.yellow.dim("network"), network);
  console.log(NetworkConfiguration.create);
  var config = NetworkConfiguration.create(network);
  console.log(chalk.yellow("network http:"), config.http);
  var augur = new Augur();
  augur.rpc.setDebugOptions(debugOptions);
  var auth = process.env.ETHEREUM_PRIVATE_KEY ? getPrivateKeyFromEnv() : getPrivateKeyFromString(config.privateKey);
  var augurWs = process.env.AUGUR_WS ? process.env.AUGUR_WS : "http://localhost:9001";
  augur.connect({ ethereumNode: { http: config.http, pollingIntervalMilliseconds: 500 }, augurNode: augurWs }, function (err) {
    if (err) {
      console.log(chalk.red("Error "), chalk.red(err));
      return callback(err);
    }
    method.method(augur, args, auth, function (err) {
      if (err) console.log(chalk.red("Error "), chalk.red(err));
      console.log(chalk.green("Finished Execution"));
      process.exit(0);
    });
  });
}

function help() {

  console.log("                                  ");
  console.log("      Welcome to FLASH ......>    ");
  console.log("                                  ");
  console.log("Usage: flash <command> OPTIONS");
  console.log("Command Help flash <command> -h");

  console.log(chalk.underline("\nUsages"));
  console.log("flash depends on the TimeControlled smart contract, this allows for pushing time");

  console.log(chalk.underline("\nCommands"));
  console.log(Object.keys(methods).join(", "), "or -h for this message");

  console.log(chalk.underline("\nNetworks"));
  console.log(NETWORKS.join(", "));

  console.log(chalk.underline("\nConfiguration"));
  console.log("Set the same " + chalk.bold("environment variables") + " used in dp for deployment process");
  console.log("ex: ETHEREUM_PRIVATE_KEY=<owner priv key>");
  console.log("ex: ETHEREUM_PRIVATE_KEY is used to change time and needs to be same account as used to upload contracts");

  console.log(chalk.underline("\nNetwork (when using 'environment' for the network)"));
  console.log(columnify([{
    env: "ETHEREUM_HTTP",
    Description: "The http(s) address of your ethereum endpoint (default: http://localhost:8545)",
  }, {
    env: "ETHEREUM_PRIVATE_KEY",
    Description: "HEX Private Key of OWNER of contracts and used to move TIME on eth node",
  }, {
    env: "GAS_PRICE_IN_NANOETH",
    Description: "The transaction gas price to use, specified in nanoeth (default: varies)",
  }, {
    env: "AUGUR_WS",
    Description: "The http endpoint for augur-node, (default: http://localhost:9001) ",
  }], {
    columnSplitter: " - ",
    minWidth: 20,
    maxWidth: 80,
    showHeaders: false,
  }));

  console.log("               ");
  console.log(chalk.underline("\Method descriptions"));
  console.log("               ");
  Object.keys(methods).sort().map(function (name) {
    console.log(chalk.underline(name));
    methods[name].method(null, "help", null, function () { });
    console.log("               ");
  });
}

if (require.main === module) {
  var opts = {
    help: {flag: true, short: "h", help: "This help" },
    network: { short: "n", default: ["environment"], help: "Network to run command against"},
  };
  var args;
  try {
    args = options.parse(opts, process.argv, function () { return true;});
    args.opt.command = args.args[2];
    args.opt.params = args.args[3];
  } catch (error) {
    console.log(error);
    help();
    process.exit();
  }
  console.log("args:", JSON.stringify(args));
  var method = methods[args.opt.command];

  if (args.opt.help) {
    if (!method) {
      help();
      process.exit();
    }
    options.help(method.opts);
    process.exit();
  }

  if (!method) {
    console.log(chalk.red("Method Not Found"), chalk.red(args.opt.command));
    console.log(chalk.red(Object.keys(methods).join(", ")));
    console.log(chalk.red("Try flash -h, to get help"));
    process.exit();
  }

  try {
    var localArgs = options.parse(method.opts, process.argv);
    runCommandWithArgs(args.opt.command, method, localArgs, args.opt.network, function () {
      process.exit();
    });
  } catch (error) {
    options.help(method.opts);
  }

}
