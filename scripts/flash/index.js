#!/usr/bin/env node

var Augur = require("../../src");
var debugOptions = require("../debug-options");
var getPrivateKeyFromString = require("../dp/lib/get-private-key").getPrivateKeyFromString;
var chalk = require("chalk");
var columnify = require("columnify");
var options = require("options-parser");

var NetworkConfiguration = require("augur-core").NetworkConfiguration;
var getBalance = require("./get-balance");
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
var pushTimestamp = require("./push-timestamp");
var setTimestamp = require("./set-timestamp-cmd");
var forceDispute = require("./force-dispute");
var forceFinalize = require("./force-finalize");

var NETWORKS = ["aura", "clique", "environment", "rinkeby", "ropsten"];
var methods = {
  "get-balance": {
    method: getBalance,
    opts: null,
  },
  "list-markets": {
    method: listMarkets,
    opts: null,
  },
  "designate-report": {
    method: designatedReport,
    opts: null,
  },
  "initial-report": {
    method: initialReport,
    opts: null,
  },
  "dispute-contribute": {
    method: disputeContribute,
    opts: null,
  },
  "finalize-market": {
    method: finalizeMarket,
    opts: null,
  },
  "push-time": {
    method: pushTime,
    opts: null,
  },
  "market-info": {
    method: marketInfo,
    opts: null,
  },
  "show-initial-reporter": {
    method: showInitialReporter,
    opts: null,
  },
  "fork": {
    method: fork,
    opts: null,
  },
  "approval": {
    method: approval,
    opts: null,
  },
  "list-market-orders": {
    method: listMarketOrders,
    opts: null,
  },
  "fill-market-orders": {
    method: fillMarketOrders,
    opts: null,
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
};

function runCommand(method, params, network, callback) {
  console.log(chalk.yellow.dim("command"), method.command);
  console.log(chalk.yellow.dim("parameters"), params);
  console.log(chalk.yellow.dim("network"), network);
  console.log(NetworkConfiguration.create);
  var config = NetworkConfiguration.create(network);
  console.log(chalk.yellow("network http:"), config.http);
  var augur = new Augur();
  augur.rpc.setDebugOptions(debugOptions);
  var auth = getPrivateKeyFromString(config.privateKey);
  var augurWs = process.env.AUGUR_WS ? process.env.AUGUR_WS : "http://localhost:9001";
  augur.connect({ ethereumNode: { http: config.http, pollingIntervalMilliseconds: 500 }, augurNode: augurWs }, function (err) {
    if (err) {
      console.log(chalk.red("Error "), chalk.red(err));
      return callback(err);
    }
    method.method(augur, params, auth, function (err) {
      if (err) console.log(chalk.red("Error "), chalk.red(err));
      console.log(chalk.green("Finished Execution"));
      process.exit(0);
    });
  });
}

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
  var auth = getPrivateKeyFromString(config.privateKey);
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
  console.log("Usage: flash <command> param1,param2,... -n network1,network2,...");
  console.log("Command Help flash <command> -h");

  console.log(chalk.underline("\nUsages"));
  console.log("Pushing Time on contracts is only possible if USE_NORMAL_TIME='false' environment variable was set when contracts were uploaded");

  console.log(chalk.underline("\nCommands"));
  console.log(Object.keys(methods).join(", "), "or help for this message");
  console.log("Run command help to get parameters needed, ie. initial-report help");

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
  Object.keys(methods).sort(function (a, b) { return a - b;}).map(function (name) {
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
  if (args.opt.help && !method) {
    help();
    process.exit();
  }
  if (!method) {
    console.log(chalk.red("Method Not Found"), chalk.red(args.opt.command));
    console.log(chalk.red(Object.keys(methods).join(", ")));
    console.log(chalk.red("try flash -h, to get help"));
    process.exit();
  }

  if (method.opts) { // new way to pass parameters
    try {
      var localArgs = options.parse(method.opts, process.argv);
      runCommandWithArgs(args.opt.command, method, localArgs, args.opt.network, function () {
        process.exit();
      });
    } catch (error) {
      options.help(method.opts);
    }
  } else { // old way to pass parameters
    if (method && args.opt.help) {
      console.log(chalk.yellow("Help for"), chalk.yellow.underline(args.opt.command));
      method.method(null, "help", null, function () { });
      process.exit(0);
    } else if (args.opt.network == null) {
      console.log(chalk.red("Network is required"));
      help();
      process.exit();
    }
    runCommand(method, args.opt.params, args.opt.network, function () {
      process.exit();
    });
  }
}
